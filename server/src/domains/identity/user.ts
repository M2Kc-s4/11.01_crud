import { ID } from "@domain/common/value-objects/id";
import TelegramLink from "@domain/common/value-objects/telegram-link";
import { DomainError } from "@shared/error";
import { equals } from "@shared/lib";
import { Serializable } from "nucleus-mold";


export const ErrUsernameLength = new DomainError("USERNAME_LENGTH", "длина имени должна быть от 8 до 32 символов")
export const ErrPasswordLength = new DomainError("PASSWORD_LENGTH", "Пароль должен быть длиннее 8 символов")
export const ErrAuthorizationFailed = new DomainError("AUTHORIZATION_FAILED", "AUTHORIZATION_FAILED")


@Serializable()
export class UserUsername {
    constructor(
        private v: string
    ) {}

    static from(username: string) {
        if (username.length < 8 || username.length > 32) throw ErrUsernameLength

        return new UserUsername(username)
    }
}


export interface PasswordHashStrategy {
    hash: (raw: string) => Promise<string>
    compare: (raw: string, hash: string) => Promise<boolean>
}


@Serializable()
export class UserRawPassword {
    constructor(
        private v: string
    ) {}

    static from(password: string) {
        if (password.length < 8) throw ErrPasswordLength
        
        return new this(password)
    }

    hash(strategy: PasswordHashStrategy) {
        return strategy.hash(this.v)
    }

    get value() {return this.v}
}


@Serializable()
export class UserHashedPassword {
    constructor(
        private v: string
    ) {}

    static from(hash: string) {
        return new UserHashedPassword(hash)
    }

    async verify(rawPassword: UserRawPassword, strategy: PasswordHashStrategy) {
        const result = await strategy.compare(rawPassword.value, this.v)
        if (!result) throw ErrAuthorizationFailed
    }
}


export type UserRoleType = 
    | "Student"
    | "Teacher"


@Serializable()
export class UserRole {
    constructor(
        private v: UserRoleType
    ) {}

    static get Teacher() { return new UserRole("Teacher") }

    static get Student() { return new UserRole("Student") }

    asString() {return this.v}
}


@Serializable()
export default class User {
    constructor(
        readonly id: ID<User>,
        private _username: UserUsername,
        private _telegramLink: TelegramLink,
        private _hashedPassword: UserHashedPassword,
        private _roles: UserRole[]
    ) {}

    static register(username: UserUsername, telegramLink: TelegramLink, hashedPassword: UserHashedPassword) {
        return new User(
            ID.generate(),
            username,
            telegramLink,
            hashedPassword,
            [UserRole.Student]
        )
    }

    addRole(role: UserRole) {
        if (this._roles.some(r => equals(r, role))) return
        
        this._roles.push(role)
    }
    
    authenticate(password: UserRawPassword, strategy: PasswordHashStrategy) {
        return this._hashedPassword.verify(password, strategy)
    }

    public get roles(): UserRole[] {
        return this._roles
    }
}