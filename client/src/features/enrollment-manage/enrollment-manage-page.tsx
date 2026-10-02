import { useParam } from "@/shared/lib/useParam";
import EnrollmentInfo from "./enrollment-info";

export default function EnrollmentManagePage() {
    const enrollmentID = useParam('enrollmentID')

    return (
        <div className="p-6 h-full">
            <EnrollmentInfo enrollmentID={enrollmentID} />
        </div>
    )
}