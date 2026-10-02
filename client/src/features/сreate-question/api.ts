import { api } from "@/shared/query-client"

export type CreateQuestionDTO = {
    topicID: string,
    text: string,
    answers: Array<{
        text: string,
        isCorrect: boolean
    }>
}

export const createQuestionApi = {
    createQuestion: ({topicID, ...question}: CreateQuestionDTO) => api.post(`/content/topics/${topicID}/questions`, question)
}