import { api } from "@/shared/query-client";
import type { CourseRead, EnrollmentRead, QuestionRead, TopicRead } from "@contracts";

export const enrollmentManageApi = {
    getEnrollmentByID: (enrollmentID: string) => api.get<EnrollmentRead>(`/learning/enrollments/${enrollmentID}`),
    startTopic: (topicID: string) => api.post<QuestionRead[]>(`/learning/topics/${topicID}/start`),
    getTopicsByCourse: (courseID: string) => api.get<TopicRead[]>(`/content/topics`, {courseID}),
    getCourseInfo: (courseID: string) => api.get<CourseRead>(`/content/courses/${courseID}`),
}