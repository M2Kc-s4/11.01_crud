import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import HashMap from "@domain/common/value-objects/hash-map";
import { ID } from "@domain/common/value-objects/id";
import type { Answer } from "@domain/content/question";
import type Question from "@domain/content/question";
import { Enrollment } from "@domain/learning/course-enrollment";
import { TopicEnrollmentAttempt } from "@domain/learning/topic-enrollment";
import { DomainError, ErrNotFound } from "@shared/error";


export type EnrollCourseCMD = {
    uid: string,
    courseID: string
}

export type StartTopicCMD = {
    uid: string,
    topicID: string,
}

export type CompleteTopicCMD = {
    topicID: string,
    uid: string,
    questions: Record<string, string[]>
}


const ErrAlreadyEnroll = new DomainError("ALREADY_ENROLLED", "ALREADY_ENROLLED")
const ErrNotEnrolled = new DomainError("NOT_ENROLLED_AT_COURSE", "NOT_ENROLLED_AT_COURSE")
const ErrCanNotStart = new DomainError("CANNOT_START_TOPIC", "CANNOT_START_TOPIC")
const ErrQuestionCountMismatch = new DomainError("QUESTION_COUNT_MISMATCH", "QUESTION_COUNT_MISMATCH")
const ErrTopicAreEmpty = new DomainError("TOPIC_ARE_EMPTY", "TOPIC_ARE_EMPTY")


export default class LearningService {
    constructor (
        private txmanager: ITransactionManager,
    ) {}


    enrollCourse(cmd: EnrollCourseCMD) {
        return this.txmanager.begin(async uow => {
            const enrolled = await uow.enrolls.isUserEnrolled(
                ID.from(cmd.uid), 
                ID.from(cmd.courseID)
            )
            
            if (enrolled) {
                throw ErrAlreadyEnroll
            }

            const enroll = Enrollment.create(
                ID.from(cmd.uid),
                ID.from(cmd.courseID),
            )

            await uow.enrolls.save(enroll)

            return {
                enrollmentID: enroll.id.asString()
            }
        })
    }


    startTopic(cmd: StartTopicCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(
                ID.from(cmd.topicID)
            )

            if (!topic) {
                throw ErrNotFound
            }

            if (await uow.questions.countByTopic(topic.id) === 0) {
                throw ErrTopicAreEmpty
            }

            const enroll = await uow.enrolls.getByUserAndCourseForUpdate(
                ID.from(cmd.uid), 
                topic.courseID
            )

            if(!enroll) {
                throw ErrNotEnrolled
            }

            if (!enroll.canStartTopic(topic.number, topic.prerequisites)) {
                throw ErrCanNotStart
            }

            return {
                topicID: topic.id.asString(),
                enrollmentID: enroll.id.asString()
            }
        })
    }


    completeTopic(cmd: CompleteTopicCMD) {
        return this.txmanager.begin(async uow => {
            const topic = await uow.topics.getByID(
                ID.from(cmd.topicID)
            )

            if (!topic) {
                throw ErrNotFound
            }

            const enroll = await uow.enrolls.getByUserAndCourseForUpdate(
                ID.from(cmd.uid), 
                topic.courseID
            )

            if (!enroll) {
                throw ErrNotEnrolled
            }

            const questions = await uow.questions.listByTopic(topic.id)            

            const questionAnswers = HashMap.fromEntries(
                Object.entries(cmd.questions)
                    .map(([question, answers]) => 
                        [ID.from<Question>(question), answers.map(ID.from<Answer>)]
                )
            )

            if (questionAnswers.size !== questions.length) {
                throw ErrQuestionCountMismatch
            }

            const completedQuestionCount = questions
                .filter(question => 
                    question.checkAnswers(
                        questionAnswers.get(question.id) ?? []
                    )
                )
                .length

            const attempt = TopicEnrollmentAttempt.create(
                completedQuestionCount,
                questions.length,
                topic.id, topic.number
            ) 

            enroll.registerAttempt(attempt)

            await uow.enrolls.save(enroll)

            return {
                enrollmentID: enroll.id.asString()
            }
        })
    }
}