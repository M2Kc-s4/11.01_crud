import { api } from "@/shared/query-client"
import type { UserRead } from "@contracts"


type RegisterDTO = {
    name: string
    telegramLink: string
    password: string
}


export const registrationApi = {
    register: (data: RegisterDTO) => api.post<UserRead>('/identity/users', data)
}