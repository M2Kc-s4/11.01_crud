import { useParam } from "@/shared/lib/useParam"
import CourseInfo from "./course-info"
import TopicList from "./topic-list"

export default function CourseEditPage() {
    const courseID = useParam('courseID')


    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <CourseInfo courseID={courseID} />
            <TopicList courseID={courseID} />
        </div>
    )
}