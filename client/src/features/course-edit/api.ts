import { api } from "@/shared/query-client";
import type { CourseRead, TopicRead } from "@contracts";

export const courseEditApi = {
    getCourseInfo: (courseID: string) => api.get<CourseRead>(`/content/courses/${courseID}`),
    getTopicsByCourse: (courseID: string) => api.get<TopicRead[]>(`/content/topics`, {courseID}),
    archiveTopic: (topicID: string) => api.post(`/content/topics/${topicID}/archive`),
    activateTopic: (topicID: string) => api.post(`/content/topics/${topicID}/activate`),
}