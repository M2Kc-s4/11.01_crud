import { api } from "@/shared/query-client";


type CreateTopicDTO = {
    title: string,
    description: string,
    courseID: string,
    accessType: "free" | "afterPrevious"
}


export const createTopicApi = {
    createTopic: ({courseID, ...data}: CreateTopicDTO) => api.post(`/content/courses/${courseID}/topics`, data)
}