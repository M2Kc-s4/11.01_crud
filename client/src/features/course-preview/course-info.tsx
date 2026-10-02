import { useGuardedCurrentUser } from "@/app/providers/current-user-provider"
import { useMutation, useQuery } from "@/shared/lib/useQuery"
import { useNavigate } from "react-router-dom"
import { coursePreviewApi } from "./api"
import { Bind } from "fluent-future"
import { toast } from "sonner"
import ROUTES from "@/app/routes"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { LogIn } from "lucide-react"
import { Spinner } from "@/shared/ui/spinner"
import { Button } from "@/shared/ui/button"


function useViewModel(courseID: string) {
    const navigate = useNavigate()
    const { user } = useGuardedCurrentUser()


    const {data, error} = useQuery({
        query: () => Bind({
            course: coursePreviewApi.getCourseInfo(courseID),
            enrollment: coursePreviewApi.getUserEnrollmentByCourse(courseID, user.id)
        })
    })


    const {mutate: enrollCourse, isPending} = useMutation({
        mutation: coursePreviewApi.enrollCourse,
        onError(err) {
            toast(err.message)
        },
        onSuccess(enrollment) {
            toast.success('Вы подписались на курс')
            navigate(ROUTES.enrollmentPage(enrollment.id))
        },
    })

    const onEnrollmentSelect = (enrollmentID: string) => () => navigate(ROUTES.enrollmentPage(enrollmentID))

    const onCourseEnroll = () => enrollCourse(courseID)


    return {
        onCourseEnroll,
        isPending,
        data,
        error,
        onEnrollmentSelect
    }
}


type CourseInfoProps = {
    courseID: string
}


export default function CourseInfo({ courseID }: CourseInfoProps) {
    const {
        data, 
        onCourseEnroll, 
        onEnrollmentSelect, 
        error, 
        isPending
    } = useViewModel(courseID)

    if (error) return <ErrorFallback message={error.message} />
    if (!data) return <Spinner />

    const { course, enrollment } = data

    
    return (
        <Card className="mb-8">
            <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                                {course.topicsCount} тем
                            </Badge>
                            <Badge variant="outline">
                                Автор: {course.createdByName}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{course.description}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {enrollment
                    ?   <Button onClick={onEnrollmentSelect(enrollment.id)}>Перейти к прохождению</Button>
                    :   <Button
                            onClick={onCourseEnroll}
                            disabled={isPending}
                            className="w-full md:w-auto"
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            {isPending ? 'Подписка...' : 'Записаться на курс'}
                        </Button>
                }
            </CardContent>
        </Card>
    )
}