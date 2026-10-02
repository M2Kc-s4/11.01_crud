import { api } from "@/shared/query-client";
import type { CourseRead } from "@contracts";

export const courseListApi = {
    getCoursesByUserID:  (userID: string) => api.get<CourseRead[]>('/content/courses', {createdBy: userID}),
    getCourseByID: (courseID: string) => api.get<CourseRead>(`/content/courses/${courseID}`),
    archiveCourse: (courseID: string) => api.post(`/content/courses/${courseID}/archive`),
    activateCourse: (courseID: string) => api.post(`/content/courses/${courseID}/activate`)
}