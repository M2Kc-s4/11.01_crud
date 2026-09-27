import { contentApi } from "@/entities/content/api"
import { useGuardedCurrentUser } from "@/entities/identity/providers/current-user-provider"
import { learningApi } from "@/entities/learning/api"
import { useMutation, useQuery } from "@/shared/lib/compose"
import { QueryKeys } from "@/shared/lib/query-keys"
import { Routes } from "@/shared/lib/routes-constants"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useEnrolledCoursesSectionVM = () => {
    const navigate = useNavigate()
    const {user} = useGuardedCurrentUser()

    const { data, error } = useQuery({
        tags: [QueryKeys.enrollmentsMe],
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
    const {user} = useGuardedCurrentUser()
    const navigate = useNavigate()


    const {data: courses, error} = useQuery({
        query: ()=> contentApi.getCoursesCreatedBy(user.id),
        tags: [QueryKeys.coursesMe]
    })


    const {mutate: activate} = useMutation({
        mutation: contentApi.activateCourse,
        invalidates: [QueryKeys.coursesMe],
        onSuccess() {
            toast('Успешно активировано')
        },
    })


    const {mutate: archive} = useMutation({
        mutation: contentApi.archiveCourse,
        onSuccess() {
            toast("Успешно архивировано")
        },
        invalidates: [QueryKeys.coursesMe]
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