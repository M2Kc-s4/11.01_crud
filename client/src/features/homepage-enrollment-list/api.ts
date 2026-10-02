import { api } from "@/shared/query-client";
import type { EnrollmentRead } from "@contracts";

export const enrollmentListApi = {
    getEnrollmentsByUser: (userID: string) => api.get<EnrollmentRead[]>('/learning/enrollments', {userID})
}