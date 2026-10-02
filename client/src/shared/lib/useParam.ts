import { useParams } from 'react-router-dom';

export function useParam(name: string): string {
    const params = useParams()
    const value = params[name]
    
    if (!value) {
        throw new Error(`Required param "${name}" is missing`)
    }
    
    return value
}