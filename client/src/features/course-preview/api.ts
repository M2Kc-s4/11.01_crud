import { api } from "@/shared/query-client";
import type { CourseRead, EnrollmentRead, TopicRead } from "@contracts";


export const coursePreviewApi = {
    getUserEnrollmentByCourse: (courseID: string, userID: string) => 
        api.get<EnrollmentRead[]>('/learning/enrollments', {userID, courseID})
            .map(([enroll]) => enroll),
    getCourseInfo: (courseID: string) => api.get<CourseRead>(`/content/courses/${courseID}`),
    enrollCourse: (courseID: string) => api.post<EnrollmentRead>(`/learning/courses/${courseID}/enrollments`),
    getTopicsByCourse: (courseID: string) => api.get<TopicRead[]>(`/content/topics`, {courseID}),
}
