import { api } from "@/shared/query-client";
import type { UserRead } from "@contracts";


type LoginDTO = {
    password: string
    username: string
}


export const authorizationApi = {
    getCurrent: () => api.get<UserRead>('/identity/users/me'),
    logout: () => api.post('/identity/auth/logout'),
    login: (data: LoginDTO) => api.post<{accessToken: string, uid: string}>('/identity/auth/login', data),
}