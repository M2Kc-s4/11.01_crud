import { AbstractReader } from "../common/abstract.reader"
import type { UserRead } from "@contracts"

export class UserReader extends AbstractReader<UserRead> {
    protected override tablename: string = 'users_r'
}