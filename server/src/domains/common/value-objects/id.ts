import { Serializable } from "nucleus-mold"
import {randomBytes} from 'node:crypto'

@Serializable()
export class ID<T> {
    constructor(
        private v: string    
    ) {}

    declare protected __brand: T
    

    static generate<T>() {
        return new ID<T>(randomBytes(16).toString('base64url'))
    }

    static from<T>(plain: string) {
        return new ID<T>(plain)
    }

    asString() { return this.v }
}