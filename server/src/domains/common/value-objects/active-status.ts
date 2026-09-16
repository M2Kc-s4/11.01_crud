import { Serializable } from "nucleus-mold"

export type StatusType = "active" | "archived"

@Serializable()
export default class Status {
    constructor(
        private v: StatusType
    ) {}

    static get Archived() {return new Status("archived")}

    static get Active() {return new Status("active")}
}