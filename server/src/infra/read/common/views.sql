CREATE OR REPLACE FUNCTION hashmap_each(hashmap_data jsonb)
RETURNS TABLE(key jsonb, value jsonb) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (ans.key)::jsonb AS key,
        ans.value AS value
    FROM jsonb_each(hashmap_data->'v') AS ans;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;


CREATE OR REPLACE FUNCTION val(vo_data jsonb)
RETURNS text AS $$
BEGIN
    RETURN vo_data->>'v';
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;



CREATE OR REPLACE FUNCTION valj(vo_data jsonb)
RETURNS jsonb AS $$
BEGIN
    RETURN vo_data->'v';
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;


CREATE OR REPLACE VIEW users_r AS
SELECT 
    id,
    val(data->'_username') AS username,
    val(data->'_telegramLink') AS "telegramLink",
    jsonb_path_query_array(data, '$._roles[*].v') AS roles
FROM users;



create or replace view courses_r as
SELECT 
    id,
    val(c.data -> '_title') AS title,
    val(c.data -> '_description') AS description,
    val(c.data -> '_status') AS status,
    val(c.data -> '_createdBy') AS "createdBy",
    (select val(data->'_username') from users where c.data->'_createdBy' = data->'id') as "createdByName", 
    (SELECT count(*) from topics WHERE data->'_byCourse' = c.data->'id') as "topicsCount",
    (SELECT count(*) FROM enrollments where data->'_courseID' = c.data->'id') as "studentsCount"
from courses c;






CREATE or replace VIEW topics_r AS
SELECT 
    id,
    val(t.data->'_number')::int AS number,
    val(t.data->'_title') AS title,
    val(t.data->'_description') AS description,
    val(t.data->'_status') AS status,
    val(t.data->'_byCourse') AS "courseID",
    val(t.data->'_createdBy') AS "createdBy",
    (select count(*) from questions where data->'_byTopic' = t.data->'id') as "questionsCount",
    jsonb_path_query_array(t.data, '$._prerequisites[*].v') AS prerequisites
FROM topics t;


CREATE or replace  VIEW questions_r AS
SELECT 
    id,
    val(data->'_text') AS text,
    val(data->'_byTopic') AS "topicID",
    val(data->'_createdBy') AS "createdBy",
    
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', val(ans.value->'id'),
                'text', val(ans.value->'_text'),
                'isCorrect', val(ans.value->'_correctness')::boolean
            )
        )
        FROM hashmap_each(data->'_answers') AS ans
    ) AS answers
FROM questions;



CREATE OR REPLACE VIEW enrollments_r AS 
SELECT 
    id,
    val(e.data->'_userID') AS "userID",
    val(e.data->'_courseID') AS "courseID",
    val(e.data->'_progress')::int AS "progress",
    (
        select val(data->'_title') 
        from courses 
        where data->'id' = e.data->'_courseID'
    ) as title,
    (
        select count(*)
        from topics
        where data->'_byCourse' = e.data->'_courseID'
    ) as "topicsCount",
    (
        select val(data->'_username')
        from users
        where data->'id' = e.data->'_userID'
    ) as username,
    (
        SELECT coalesce(
            jsonb_agg(
                jsonb_build_object(
                    'id', val(value->'id'),
                    'topicID', val(value->'_topicID'),
                    'completedQuestions', (value->'_progress'->>'_completed')::int,
                    'questionCount', (value->'_progress'->>'_total')::int,
                    'number', val(value->'_number')::int,
                    'isCompleted', (value->'_progress'->>'_completed')::int >= (value->'_progress'->>'_total')::int * 0.8
                )
            ),
            '[]'::jsonb
        )
        FROM hashmap_each(e.data->'_topicEnrollments')
    ) AS "topicEnrollments"
FROM enrollments e;
