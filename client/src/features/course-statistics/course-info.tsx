import { useQuery } from "@/shared/lib/useQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Bind } from "fluent-future";
import { BarChart2 } from "lucide-react";
import { courseStatisticsApi } from "./api";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import EnrollmentList from "./enrollment-list";


function useViewModel(courseID: string) {
    const { data, error } = useQuery({
        query: () => Bind({
            course: courseStatisticsApi.getCourseInfo(courseID),
            enrollments: courseStatisticsApi.getEnrollmentsByCourse(courseID)
        })
    })

    return {
        data, 
        error
    }
}


type CourseInfoProps = {
    courseID: string
}

export default function CourseInfo({ courseID }: CourseInfoProps) {
    const { data, error } = useViewModel(courseID)

    if (error) return <ErrorFallback message={error.message} />
    if (!data) return <Spinner />

    const {course, enrollments} = data
    
    const avgProgress = enrollments.reduce((s, e) => s += e.progress, 0) / enrollments.length
    const completedCount = enrollments.filter(e => e.progress === course.topicsCount).length

    return (
        <div className="p-6 h-full">
            <div className="max-w-3xl mx-auto">
                <Card className="mb-6 border-foreground">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BarChart2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{course.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {course.createdByName}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                                <span className="text-2xl font-bold">{enrollments.length}</span>
                                <span className="text-sm text-muted-foreground">Студентов</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                                <span className="text-2xl font-bold">{avgProgress / course.topicsCount * 100 || 0}%</span>
                                <span className="text-sm text-muted-foreground">Средний прогресс</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                                <span className="text-2xl font-bold">{completedCount}</span>
                                <span className="text-sm text-muted-foreground">Завершили</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <EnrollmentList enrollments={enrollments} />        
            </div>
        </div>
    )
}