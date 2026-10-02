import { useQuery } from "@/shared/lib/useQuery";
import { courseEditApi } from "./api";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/app/routes";
import { Fragment } from "react/jsx-runtime";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import { Button } from "@/shared/ui/button";
import { BarChart3 } from "lucide-react";


function useViewModel(courseID: string) {
    const navigate = useNavigate()

    const { data: course, error } = useQuery({
        query: () => courseEditApi.getCourseInfo(courseID)
    })

    const onCourseStatsSelect = () => navigate(ROUTES.courseStaticticsPage(courseID))

    return {
        course, 
        error,
        onCourseStatsSelect
    }
}


export default function CourseInfo({courseID}: {courseID: string}) {
    const {course, onCourseStatsSelect, error} = useViewModel(courseID)

    if (error) return <ErrorFallback message={error.message} />
    if (!course) return <Spinner />

    return (
        <Fragment>
            <div className="text-center">
                    <h1 className="text-2xl font-bold">{course.title}</h1>
                    <p className="text-muted-foreground mt-1">{course.description}</p>
            </div>

            <div className="flex justify-center gap-4">
                <Button size='xs' variant="outline" color='secondary' onClick={onCourseStatsSelect}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Статистика курса
                </Button>
            </div>
        </Fragment>
    )
}