import { useParam } from "@/shared/lib/useParam";
import CourseInfo from "./course-info";

export default function courseStaticticsPage() {
    const courseID = useParam("courseID")

    return <CourseInfo courseID={courseID} />
}