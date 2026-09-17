import DateTime from "@domain/common/value-objects/date-time"
import { ID } from "@domain/common/value-objects/id"
import type Topic from "@domain/content/topic"
import type { TopicNumber } from "@domain/content/topic"
import { Serializable } from "nucleus-mold"


@Serializable()
export class TopicEnrollmentProgress {
    constructor(
        private _completed: number,
        private _total: number
    ) {}

    static createNullish() {
        return new TopicEnrollmentProgress(0, 0)
    }


    static create(completed: number, total: number) {
        return new TopicEnrollmentProgress(total, completed)
    }
    

    get total() {return this._total}
    get ratio() {return this._completed / this._total || 0}
}


@Serializable()
export class TopicEnrollmentAttempt {
    constructor(
        private _attemptedAt: DateTime,
        private _completedCount: number,
        private _totalCount: number,
        private _topicID: ID<Topic>,
        private _topicNumber: TopicNumber
    ) {}

    static create(completed: number, total: number, topicID: ID<Topic>, topicNumber: TopicNumber) {
        return new TopicEnrollmentAttempt(
            DateTime.now(), completed, 
            total, topicID, topicNumber
        )
    }
    

    get completed() {return this._completedCount}
    get total() {return this._totalCount}
    get ratio() {return this._completedCount / this._totalCount || 0}
    get topicID() {return this._topicID}
    get number() {return this._topicNumber}
}


@Serializable()
export default class TopicEnrollment {
    private static readonly COMPLETION_THRESHOLD = 0.8

    constructor(
        readonly id: ID<TopicEnrollment>,
        private _topicID: ID<Topic>,
        private _progress: TopicEnrollmentProgress,
        private _number: TopicNumber
    ) {}
    

    static create(topicID: ID<Topic>, number: TopicNumber) {
        return new TopicEnrollment(
            ID.generate(),
            topicID,
            TopicEnrollmentProgress.createNullish(),
            number
        )
    }


    registerAttempt(attempt: TopicEnrollmentAttempt) {
        if (attempt.ratio >= this._progress.ratio) {
            this._progress = TopicEnrollmentProgress.create(attempt.completed, attempt.total)
        }
    }


    isCompleted() { return this._progress.ratio >= TopicEnrollment.COMPLETION_THRESHOLD }
    get topicID() { return this._topicID }
}