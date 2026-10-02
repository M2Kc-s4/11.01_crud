import { api } from "@/shared/query-client";
import type { CourseRead, EnrollmentRead } from "@contracts";

export const courseStatisticsApi = {
    getCourseInfo: (courseID: string) => api.get<CourseRead>(`/content/courses/${courseID}`),
    getEnrollmentsByCourse: (courseID: string) => api.get<EnrollmentRead[]>(`/learning/enrollments`, {courseID})
}