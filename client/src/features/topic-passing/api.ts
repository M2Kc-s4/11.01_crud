import { api } from "@/shared/query-client";
import type { EnrollmentRead, QuestionRead } from "@contracts";

type AnsweredQuestion = Record<string, string[]>


export const topicPassingApi = {
    startTopic: (topicID: string) => api.post<QuestionRead[]>(`/learning/topics/${topicID}/start`),
    completeTopic: (topicID: string, questions: AnsweredQuestion) => api.post<EnrollmentRead>(`/learning/topics/${topicID}/complete`, questions),   
}