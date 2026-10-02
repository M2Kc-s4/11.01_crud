import { useQuery } from "@/shared/lib/useQuery"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Progress } from "@/shared/ui/progress"
import { BarChart2, BookOpen, Check, List, LogOut, Share2, User } from "lucide-react"
import { enrollmentManageApi } from "./api"
import { Bind } from "fluent-future"
import { useClipboard } from "@/shared/lib/useClipboard"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { Spinner } from "@/shared/ui/spinner"
import ROUTES from "@/app/routes"
import TopicList from "./topic-list"

type EnrollmentInfoProps = {
    enrollmentID: string
}


function useViewModel(enrollmentID: string) {
    const { data: enrollmentInfo, error } = useQuery({
        query: () => Bind({
            enrollment: enrollmentManageApi.getEnrollmentByID(enrollmentID)
        }).bind({
            course: ({enrollment}) => enrollmentManageApi.getCourseInfo(enrollment.courseID)
        })
    })

    const copy = useClipboard()

    const onCourseCopy = () => {
        enrollmentInfo && copy(`${window.location.host}${ROUTES.coursePage(enrollmentInfo.course.id)}`)
    }

    return {
        enrollmentInfo,
        error,
        onCourseCopy
    }
}


export default function EnrollmentInfo({ enrollmentID }: EnrollmentInfoProps) {
    const { enrollmentInfo, error, onCourseCopy } = useViewModel(enrollmentID)

    if (error) return <ErrorFallback message={error.message} />
    if (!enrollmentInfo) return <Spinner />


    const { course, enrollment } = enrollmentInfo

    const enrollmentProgress = (enrollment.progress / course.topicsCount || 0) * 100


    return (
        <div className="max-w-3xl mx-auto">
            <Card className="mb-6 border-foreground">
                <CardHeader className="flex justify-between items-start space-y-0">
                    <section className="w-full flex-col flex gap-2">
                        <div className="flex flex-col w-full gap-2 max-w-full">
                            <CardTitle className="max-w-full flex flex-wrap gap-2 items-center mb-1">
                                <div className="p-2 max-sm:hidden bg-primary/10 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                {course.title}
                            </CardTitle>

                            <div className="flex items-baseline justify-between">
                                <div className="flex items-center gap-2 flex-wrap max-w-62.5">
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <List className="h-3 w-3" />
                                        {course.topicsCount} тем.
                                    </Badge>
                                    <Badge>
                                        <User className="h-3 w-3 mr-1" />
                                        Автор: {course.createdByName}
                                    </Badge>
                                    <Badge className="bg-green-400" variant="default">
                                        <Check className="h-3 w-3 mr-1" />
                                        Подписан
                                    </Badge>
                                </div>

                                <div className="w-fit flex flex-col max-md:hidden gap-2">
                                    <Button 
                                    onClick={onCourseCopy}
                                    variant="outline" 
                                    className="flex items-center gap-2"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        <span className="max-md:hidden">Поделиться курсом</span>
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2 text-red-600">
                                        <LogOut className="h-4 w-4" />
                                        Отписаться
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 md:hidden">
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-2 border border-foreground cursor-pointer"
                                >
                                    <Share2 className="h-4 w-4" />
                                    <span>Поделиться курсом</span>
                                </Badge>
                                <Badge
                                    variant="destructive"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Отписаться
                                </Badge>
                            </div>
                        </div>
                    </section>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress value={enrollmentProgress} />
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BarChart2 className="h-4 w-4" />
                            {Math.round(enrollmentProgress)}% завершено
                        </div>
                    </div>
                </CardContent>
            </Card>

            <TopicList enrollment={enrollment} />
        </div>
    )
}