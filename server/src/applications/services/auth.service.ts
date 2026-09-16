import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import Session, { AccessToken, ErrRefreshTokenInvalid, ErrSessionNotFound, RefreshToken, type IJWTSigner } from "@domain/identity/session";
import { ErrAuthorizationFailed, UserRawPassword, UserUsername, type PasswordHashStrategy } from "@domain/identity/user";
import { equals } from "@shared/lib";


type AuthorizeCMD = {
    username: string
    password: string
}

type RefreshTokensCMD = {
    refreshToken: string
}

type VerifyAccessTokenCMD = {
    accessToken: string
}


export class AuthService {
    constructor (
        private readonly txmanager: ITransactionManager,
        private readonly passwordHashStrategy: PasswordHashStrategy,
        private readonly tokenSigner: IJWTSigner
    ) {}


    async authorize(cmd: AuthorizeCMD) {
        return this.txmanager.begin(async uow => {
            const user = await uow.users.getByName(
                UserUsername.from(cmd.username)
            )

            if (!user) throw ErrAuthorizationFailed

            await user.authenticate(
                UserRawPassword.from(cmd.password), 
                this.passwordHashStrategy
            )

            const session = Session.new(user.id)

            const refreshToken = await RefreshToken.generate(
                session, this.tokenSigner
            )

            session.updateToken(refreshToken)

            await uow.sessions.save(session)

            const accessToken = await AccessToken.generate(
                user, this.tokenSigner
            )

            return {
                refreshToken: refreshToken.asString(), 
                accessToken: accessToken.asString(), 
                uid: user.id.asString()
            }
        })  
    }


    async refreshTokens(cmd: RefreshTokensCMD) {
        const {uid, sessionID} = await RefreshToken.from(cmd.refreshToken)
            .verify(this.tokenSigner)

        return this.txmanager.begin(async uow => {
            const session = await uow.sessions.getByIDForUpdate(sessionID)
            
            if (!session) {
                throw ErrSessionNotFound
            }

            if (!session.refreshToken) throw ErrRefreshTokenInvalid

            if (!equals(session.refreshToken, RefreshToken.from(cmd.refreshToken))) {
                throw ErrRefreshTokenInvalid
            }

            session.updateActivity()

            const refreshToken = await RefreshToken.generate(
                session, this.tokenSigner
            )

            session.updateToken(refreshToken)

            const user = await uow.users.getByID(uid)

            if (!user) {
                throw ErrSessionNotFound
            }

            const accessToken = await AccessToken.generate(
                user, this.tokenSigner
            )

            await uow.sessions.save(session)

            return {
                refreshToken: refreshToken.asString(), 
                accessToken: accessToken.asString()
            }
        })
    }


    async verifyAccess(cmd: VerifyAccessTokenCMD) {
        const accessToken = AccessToken.from(cmd.accessToken)
        const {uid, roles} = await accessToken.verify(this.tokenSigner)

        return {
            uid: uid.asString(),
            roles: roles.map(r => r.asString())
        }
    }
}