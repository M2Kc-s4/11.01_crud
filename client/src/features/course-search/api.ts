import { api } from "@/shared/query-client";
import type { CourseRead } from "@contracts";

export const courseSearchApi = {
    searchCourses: (query: string) => api.get<CourseRead[]>(`/content/courses/search?q=${encodeURIComponent(query)}`)
}