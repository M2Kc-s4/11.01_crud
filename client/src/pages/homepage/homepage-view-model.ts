import { contentApi } from "@/entities/content/api"
import { useGuardedCurrentUser } from "@/entities/identity/providers/current-user-provider"
import { learningApi } from "@/entities/learning/api"
import { useMutation, useQuery } from "@/shared/lib/compose"
import { Routes } from "@/shared/lib/routes-constants"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useEnrolledCoursesSectionVM = () => {
    const navigate = useNavigate()
    const { user } = useGuardedCurrentUser()

    const { data, error } = useQuery({
        query: () => learningApi.getEnrollmentsByUser(user.id),
    })

    const onEnrollmentSelect = (enrollmentID: string) => () => navigate(Routes.enrollmentPage(enrollmentID))

    return {
        enrollments: data,
        error,
        onEnrollmentSelect
    }
}


export const useCreatedCoursesSectionVM = () => {
    const { user } = useGuardedCurrentUser()
    const navigate = useNavigate()


    const {data: courses, error} = useQuery({
        query: () => contentApi.getCoursesCreatedBy(user.id),
        tags: 'my-courses'
    })


    const {mutate: activate} = useMutation({
        mutation: contentApi.activateCourse,
        refetches: 'my-courses',
        onSuccess: () => toast('Успешно активировано')
    })


    const {mutate: archive} = useMutation({
        mutation: contentApi.archiveCourse,
        refetches: 'my-courses',
        onSuccess: () => toast("Успешно архивировано")
    })

    const onCourseSelect = (courseID: string) => () => navigate(Routes.courseEditPage(courseID))
    const onCourseArchive = (courseID: string) => () => archive(courseID)
    const onCourseActivate = (courseID: string) => () => activate(courseID)

    return {
        courses, 
        error, 
        onCourseActivate,
        onCourseArchive,
        onCourseSelect
    }
}