import { api } from "@/shared/query-client";
import type { QuestionRead, TopicRead } from "@contracts";

export const topicEditApi = {
    getQuestionsByTopic: (topicID: string) => api.get<QuestionRead[]>(`/content/questions`, {topicID}),
    getTopicByID: (topicID: string) => api.get<TopicRead>(`/content/topics/${topicID}`)
}