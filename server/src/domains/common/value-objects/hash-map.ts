import { Json, Serializable } from "nucleus-mold"


@Serializable()
export default class HashMap<K, V> {
    constructor(
        private v: Record<number, V>
    ) {}
    
    static new<K, V>(): HashMap<K, V> {
        return new HashMap({})
    }

    static fromEntries<K, V>(entries: [K, V][]): HashMap<K, V> {
        const map = HashMap.new()

        entries.forEach(entry => {
            map.set(entry[0], entry[1])
        })

        return map as any
    }

    public set(key: K, value: V): void {
        const hash = hashString(JSON.stringify(key))
        this.v[hash] = value
    }

    public get(key: K): V | undefined {
        const hash = hashString(JSON.stringify(key))
        return this.v[hash]
    }

    public has(key: K): boolean {
        const hash = hashString(JSON.stringify(key))
        return hash in this.v
    }

    public values(): V[] {
        return Object.values(this.v)
    }

    public get size(): number {
        return Object.values(this.v).length
    }
}


function hashString(string: string) {
    let hash = 0x811c9dc5

    for (let i = 0x0; i < string.length; i++) {
        hash ^= string.charCodeAt(i)
        hash = Math.imul(hash, 0x01000193)
    }

    return hash >>> 0
}
