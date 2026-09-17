import type { PasswordHashStrategy } from "@domain/identity/user"

export class BCryptHashStrategy implements PasswordHashStrategy {
    hash(raw: string) {
        return Bun.password.hash(raw)
    }

    compare(raw: string, hash: string) {
        return Bun.password.verify(raw, hash)
    }
}