import type { IUserRepository } from "@applications/interfaces/itransaction-manager"
import { sql } from "@m2k-5f/pgtx"
import type User from "@domain/identity/user"
import type { UserUsername } from "@domain/identity/user"
import { AbstractRepository, type RowData } from "../common/abstract_repository"

export class UserRepository extends AbstractRepository<User> implements IUserRepository {
    protected override tablename: string = "users"


    async getByName(name: UserUsername) {
        const [row] = await this.tx.query<RowData>
        `select data::text from ${sql.ident(this.tablename)} 
        where data->'_username' = ${name};`
        
        return row ? this.fromRow(row) : null
    }


    async checkNameExists(name: UserUsername): Promise<boolean> {
        const [res] = await this.tx.query
        `select 1 from ${sql.ident(this.tablename)} 
        where data->'_username' = ${name}
        limit 1;`
        
        return !!res
    }
}