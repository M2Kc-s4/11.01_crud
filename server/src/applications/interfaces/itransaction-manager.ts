import type { ID } from "@domain/common/value-objects/id"
import type { CourseTitle } from "@domain/content/course"
import type Course from "@domain/content/course"
import type Question from "@domain/content/question"
import type Topic from "@domain/content/topic"
import type Session from "@domain/identity/session"
import type { UserUsername } from "@domain/identity/user"
import type User from "@domain/identity/user"
import type { Enrollment } from "@domain/learning/course-enrollment"

export interface ITransactionWorkUnit {
    readonly users: IUserRepository
    readonly courses: ICourseRepository
    readonly topics: ITopicRepository
    readonly questions: IQuestionRepository
    readonly enrolls: IEnrollmentRepository
    readonly sessions: ISessionRepository
}

export interface ITransactionManager {
    begin<T>(func: (ctx: ITransactionWorkUnit) => Promise<T>): Promise<T>
}

export interface IRepository<Tentity, TID = ID<Tentity>> {
    save(...root: Array<Tentity>): Promise<void>

    getByIDForUpdate(id: TID): Promise<Tentity | null>
    getByID(id: TID): Promise<Readonly<Tentity> | null>
}

export interface IUserRepository extends IRepository<User> {
    checkNameExists(name: UserUsername): Promise<boolean>
    getByName(name: UserUsername): Promise<Readonly<User> | null>
}

export interface ICourseRepository extends IRepository<Course> {
    checkCourseExistsOnUser(userID: ID<User>, title: CourseTitle): Promise<boolean>
}

export interface ITopicRepository extends IRepository<Topic> {
    countByCourse(courseID: ID<Course>): Promise<number>
    listByCourse(courseID: ID<Course>): Promise<Array<Readonly<Topic>>>
}

export interface IQuestionRepository extends IRepository<Question> {
    listByTopic(topicID: ID<Topic>): Promise<Array<Readonly<Question>>>
    countByTopic(topicID: ID<Topic>): Promise<number>
}

export interface IEnrollmentRepository extends IRepository<Enrollment> {
    isUserEnrolled(userID: ID<User>, courseID: ID<Course>): Promise<boolean>

    getByUserAndCourseForUpdate(userID: ID<User>, courseID: ID<Course>): Promise<Enrollment | null>
    getByUserAndCourse(userID: ID<User>, courseID: ID<Course>): Promise<Readonly<Enrollment> | null>

    listByCourseForUpdate(courseID: ID<Course>): Promise<Array<Enrollment>>
}

export interface ISessionRepository extends IRepository<Session> {}