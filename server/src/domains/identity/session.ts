import { Serializable } from "nucleus-mold"
import { UnauthorizedError } from "@shared/error"
import type User from "./user"
import { ID } from "@domain/common/value-objects/id"
import type { UserRole } from "./user"
import DateTime from "@domain/common/value-objects/date-time"


export const ErrSessionNotFound = new UnauthorizedError("SESSION_NOT_FOUND", "Сессия не найдена")
export const ErrRefreshTokenInvalid = new UnauthorizedError("INVAlID_REFRESH_TOKEN", "Refresh токен невалиден")
export const ErrTokenExpired = new UnauthorizedError("ACCESS_TOKEN_EXPIRED", "token expired")


export interface IJWTSigner {
    signRefresh(session: Readonly<Session>): Promise<string>
    verifyRefresh(token: string): Promise<{uid: ID<User>, sessionID: ID<Session>}>
    signAccess(user: Readonly<User>): Promise<string>
    verifyAccess(token: string): Promise<{uid: ID<User>, roles: UserRole[]}>
}


@Serializable()
export class RefreshToken {
    constructor(private v: string) {}

    static async generate(session: Readonly<Session>, signStrategy: IJWTSigner) {
        return new RefreshToken(await signStrategy.signRefresh(session))
    }

    async verify(signStrategy: IJWTSigner) {
        try {
            return await signStrategy.verifyRefresh(this.v)
        } catch {
            throw ErrRefreshTokenInvalid
        }
    }

    static from(string: string) {
        return new RefreshToken(string)
    }

    asString() {return this.v}
}


export class AccessToken {
    constructor(private v: string) {}

    static async generate(user: Readonly<User>, signStrategy: IJWTSigner) {
        return new AccessToken(await signStrategy.signAccess(user))
    }

    async verify(signStrategy: IJWTSigner) {
        try {
            return await signStrategy.verifyAccess(this.v)
        } catch {
            throw ErrTokenExpired
        }
    }

    static from(string: string) {
        return new AccessToken(string)
    }
    
    asString() {return this.v}
}


@Serializable()
export default class Session {
    constructor(
        readonly id: ID<Session>,
        private _userID: ID<User>,
        private _lastActivity: DateTime,
        private _currentToken: RefreshToken | null
    ) {}
    
    static new(userID: ID<User>) {
        return new Session(
            ID.generate(),
            userID,
            DateTime.now(),
            null,
        )
    }

    updateToken(newRefresh: RefreshToken) {
        this._currentToken = newRefresh
    }

    updateActivity() {
        this._lastActivity = DateTime.now()
    }

    get refreshToken() {return this._currentToken}
    get userID() {return this._userID}
}