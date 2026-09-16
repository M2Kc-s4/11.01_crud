import { ID } from "@domain/common/value-objects/id"
import { DomainError } from "@shared/error"
import { Serializable } from "nucleus-mold"
import type Course from "./course"
import type User from "@domain/identity/user"
import Status from "@domain/common/value-objects/active-status"
import { equals } from "@shared/lib"

export const ErrTopicArchived = new DomainError("TOPIC_ARCHIVED", "TOPIC_ARCHIVED")
export const ErrTopicActive = new DomainError("TOPIC_ACTIVE", "TOPIC_ACTIVE")
export const ErrTopicTitleLength = new DomainError("TOPIC_TITLE_LENGTH", "TOPIC_TITLE_LENGTH")
export const ErrTopicDescriptionLength = new DomainError("TOPIC_DESCRIPTION_LENGTH", "TOPIC_DESCRIPTION_LENGTH")


@Serializable()
export class TopicTitle {
    constructor(private v: string) {}

    static from(title: string) {
        if (title.length < 8 || title.length > 64) throw ErrTopicTitleLength

        return new TopicTitle(title)
    }
}


@Serializable()
export class TopicDescription {
    constructor(private v: string) {}

    static from(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrTopicDescriptionLength

        return new TopicDescription(description)
    }
}


@Serializable()
export class TopicNumber {
    constructor(private v: number) {}

    static from(number: number) {
        return new TopicNumber(number)
    }

    next() { return new TopicNumber(this.v + 1) }
    previous() { return new TopicNumber(this.v - 1) }

    isFirst() { return this.v === 0 }

    asNumber() {return this.v}
}


@Serializable()
export default class Topic {
    private constructor(
        readonly id: ID<Topic>,
        private _title: TopicTitle,
        private _description: TopicDescription ,
        private _byCourse: ID<Course>,
        private _createdBy: ID<User>,
        private _status: Status,
        private _prerequisites: TopicNumber[],
        private _number: TopicNumber
    ) {}


    static createWithFreeAccess(byCourse: ID<Course>, title: TopicTitle, description: TopicDescription, createdBy: ID<User>, number: TopicNumber) {
        return new Topic(
            ID.generate(),
            title,
            description,
            byCourse,
            createdBy,
            Status.Active,
            [],
            number
        )
    }


    static createWithAccessAfterPrevious(byCourse: ID<Course>, title: TopicTitle, description: TopicDescription, createdBy: ID<User>, number: TopicNumber) {
        return new Topic(
            ID.generate(),
            title,
            description,
            byCourse,
            createdBy,
            Status.Active,
            number.isFirst() ? [] : [number.previous()],
            number
        )
    }


    archive() {
        if (equals(this._status, Status.Archived)) throw ErrTopicArchived
        
        this._status = Status.Archived
    }


    activate() {
        if (equals(this._status, Status.Active)) throw ErrTopicActive

        this._status = Status.Active
    }


    get courseID() {return this._byCourse}
    get createdBy() { return this._createdBy }
    get prerequisites() {return this._prerequisites }
    get number() {return this._number}
}

