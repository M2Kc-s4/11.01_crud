import { api } from "@/shared/query-client"

type CreateCourseDTO = {
    title: string,
    description: string,
}

export const createCourseApi = {
    createCourse: (data: CreateCourseDTO) => api.post('/content/courses', data)
}