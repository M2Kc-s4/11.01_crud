import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never
}[keyof T]


export function sorted<T extends Record<string, any>>(
    array: T[], 
    param: NumericKeys<T>
) {
    return [...array].sort((a, b) => a[param] - b[param])
}


export function formatDate(dateString: string) {
    const date = new Date(dateString)

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}


export function getInitials(name: string) {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
}