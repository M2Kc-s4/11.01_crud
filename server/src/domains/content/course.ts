import Status from "@domain/common/value-objects/active-status"
import { ID } from "@domain/common/value-objects/id"
import type User from "@domain/identity/user"
import { DomainError } from "@shared/error"
import { equals } from "@shared/lib"
import { Serializable } from "nucleus-mold"


const ErrCourseTitleLength = new DomainError("COURSE_TITLE_LENGTH", "Название курса должно быть от 8 до 64 символов в длину")
const ErrCourseDescriptionLength = new DomainError("COURSE_DESCRIPTION_LENGTH", "Описание курса должно быть от 8 до 128 символов в длину")
const ErrCourseArchived = new DomainError("COURSE_ARCHIVED", "COURSE_ARCHIVED")
const ErrCourseActive = new DomainError("COURSE_ACTIVE", "COURSE_ACTIVE")


@Serializable()
export class CourseTitle {
    constructor(private v: string) {}

    static from(title: string) {
        if (title.length < 8 || title.length > 64) throw ErrCourseTitleLength

        return new this(title)
    }
}


@Serializable()
export class CourseDescription {
    constructor(private v: string) {}

    static from(description: string) {
        if (description.length < 8 || description.length > 128) throw ErrCourseDescriptionLength

        return new this(description)
    }
}

@Serializable()
export default class Course {
    constructor(
        readonly id: ID<Course>,
        private _title: CourseTitle,
        private _description: CourseDescription,
        private _status: Status,
        private _createdBy: ID<User>
    ) {}

    static create(title: CourseTitle, description: CourseDescription, createdBy: ID<User>) {
        return new Course(
            ID.generate(),
            title,
            description,
            Status.Active,
            createdBy
        )
    }

    archive() {
        if (equals(this._status, Status.Archived)) throw ErrCourseArchived

        this._status = Status.Archived
    }

    activate() {
        if (equals(this._status, Status.Active)) throw ErrCourseActive

        this._status = Status.Active
    }

    get createdBy() {return this._createdBy}
}