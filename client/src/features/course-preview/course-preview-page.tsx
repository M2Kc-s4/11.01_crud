import { useParam } from "@/shared/lib/useParam";
import CourseInfo from "./course-info";
import TopicList from "./topic-list";

export default function CoursePreviewPage() {
    const courseID = useParam("courseID")

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <CourseInfo courseID={courseID} />
            <TopicList courseID={courseID} />
        </div>
    )
}