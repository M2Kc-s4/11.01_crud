import { useGuardedCurrentUser } from "@/app/providers/current-user-provider"
import { useMutation, useQuery } from "@/shared/lib/useQuery"
import { useNavigate } from "react-router-dom"
import { courseListApi } from "./api"
import { toast } from "sonner"
import ROUTES from "@/app/routes"
import { useState } from "react"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { Spinner } from "@/shared/ui/spinner"
import CreateCourseDialog from "../create-course/create-course-dialog"
import CreateCourseButton from "../create-course/create-course-button"
import { Users } from "lucide-react"
import CourseCard from "./course-card"


function useViewModel() {
    const { user } = useGuardedCurrentUser()
    const navigate = useNavigate()


    const {data: courses, error} = useQuery({
        query: () => courseListApi.getCoursesByUserID(user.id),
        tags: 'courses'
    })


    const {mutate: activate} = useMutation({
        mutation: courseListApi.activateCourse,
        refetches: 'courses',
        onSuccess: () => toast('Успешно активировано')
    })


    const {mutate: archive} = useMutation({
        mutation: courseListApi.archiveCourse,
        refetches: 'courses',
        onSuccess: () => toast("Успешно архивировано")
    })

    const onCourseSelect = (courseID: string) => () => navigate(ROUTES.courseEditPage(courseID))
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


export default function HomepageCourseList() {
    const {courses, error, onCourseArchive, onCourseActivate, onCourseSelect} = useViewModel()
    const [isCreateCourseDialogOpen, setDialogOpen] = useState<boolean>(false)

    
    if (error) return <ErrorFallback message={error.message} />
    if (!courses) return <Spinner />


    return (
        <section className="space-y-4">
            <CreateCourseDialog open={isCreateCourseDialogOpen} onOpenChange={setDialogOpen} />
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Управление курсами</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreateCourseButton onClick={() => setDialogOpen(true)} />
                
                {courses.map(course =>
                    <CourseCard
                        key={course.id}
                        course={course}
                        onArchive={onCourseArchive(course.id)}
                        onActivate={onCourseActivate(course.id)}
                        onOpen={onCourseSelect(course.id)}
                    />
                )}
            </div>
        </section>
    )
}