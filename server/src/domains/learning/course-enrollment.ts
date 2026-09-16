import { DomainError } from "@shared/error"
import type { TopicNumber } from "@domain/content/topic"
import { Serializable } from "nucleus-mold"
import { ID } from "@domain/common/value-objects/id"
import type User from "@domain/identity/user"
import type Course from "@domain/content/course"
import HashMap from "@domain/common/value-objects/hash-map"
import TopicEnrollment from "./topic-enrollment"
import type { TopicEnrollmentAttempt } from "./topic-enrollment"


export const ErrTopicEnrollmentNotDefined = new DomainError('TOPIC_ENROLLMENT_NOT_DEFINED', 'TOPIC_ENROLLMENT_NOT_DEFINED')


@Serializable()
export class EnrollmentProgress {
    constructor(private v: number) {}

    static createNullish() {
        return new EnrollmentProgress(0)
    }

    incremented() { return new EnrollmentProgress(this.v + 1) }

    get completedCount() { return this.v }
}


@Serializable()
export class Enrollment {
    private constructor(
        readonly id: ID<Enrollment>,
        private _userID: ID<User>,
        private _courseID: ID<Course>,
        private _progress: EnrollmentProgress,
        private _topicEnrollments: HashMap<TopicNumber, TopicEnrollment>
    ) {}


    static create(userID: ID<User>, courseID: ID<Course>) {
        return new Enrollment(
            ID.generate(),
            userID,
            courseID,
            EnrollmentProgress.createNullish(),
            HashMap.new()
        )
    }


    registerAttempt(attempt: TopicEnrollmentAttempt) {
        const number = attempt.number

        if (!this._topicEnrollments.has(number)) {
            this._topicEnrollments.set(number, TopicEnrollment.create(attempt.topicID, attempt.number))
        }

        const topicEnrollment = this._topicEnrollments.get(number)!
        const wasCompleted = topicEnrollment.isCompleted()

        topicEnrollment.registerAttempt(attempt)

        if (!wasCompleted && topicEnrollment.isCompleted()) {
            this._progress = this._progress.incremented()
        }
    }


    canStartTopic(number: TopicNumber, prerequisites: TopicNumber[]) {
        if (number.isFirst()) return true

        const passed = prerequisites.every(preq => {
            return this._topicEnrollments.get(preq)?.isCompleted()
        })
        
        return passed
    }
}