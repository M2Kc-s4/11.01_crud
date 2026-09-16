import { ID } from '@domain/common/value-objects/id'
import type Session from '@domain/identity/session'
import type { IJWTSigner } from '@domain/identity/session'
import type User from '@domain/identity/user'
import { UserRole, type UserRoleType } from '@domain/identity/user'
import { KeyObject } from 'crypto'
import { jwtVerify, SignJWT } from 'jose'


export class TokenSigner implements IJWTSigner {
    constructor(
        private accessPub: KeyObject,
        private accessPri: KeyObject,
        private refreshPub: KeyObject,
        private refreshPri: KeyObject,
    ) {}

    async signAccess(user: Readonly<User>) {
        const token = await new SignJWT({roles: user.roles.map(r => r.asString())})
        .setProtectedHeader({ alg: 'ES256' })
        .setSubject(user.id.asString())
        .setExpirationTime(Bun.env.ACCESS_TTL)
        .setIssuedAt()
        .sign(this.accessPri)

        return token
    }

    async signRefresh(session: Readonly<Session>) {
        const token = await new SignJWT({sessionID: session.id.asString()})
        .setProtectedHeader({ alg: 'ES256' })
        .setIssuedAt()
        .setExpirationTime(Bun.env.SESSION_TTL)
        .setSubject(session.userID.asString())
        .sign(this.refreshPri)

        return token
    }

    async verifyAccess(access: string) {
        const {sub, roles} = (await jwtVerify(access, this.accessPub)).payload as {sub: string, roles: UserRoleType[]}
    
        return {uid: ID.from<User>(sub), roles: roles.map(r => r === 'Student' ? UserRole.Student : UserRole.Teacher)}
    }

    async verifyRefresh(refresh: string) {
        const {sub, sessionID} = (await jwtVerify(refresh, this.refreshPub)).payload as {sub: string, sessionID: string}
        return {uid: ID.from<User>(sub), sessionID: ID.from<Session>(sessionID)}
    }
}