export type Branded<T, Brand> = T & {__brand: Brand}

export const equals = <T>(a: T, b: T) => Bun.deepEquals(a, b, true)