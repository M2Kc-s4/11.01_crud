import type { EnrollmentRead } from "@contracts";
import { Fragment } from "react/jsx-runtime";
import EnrollmentCard from "./enrollment-card";
import { sorted } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";

type EnrollmentListProps = {
    enrollments: EnrollmentRead[]
}

export default function EnrollmentList({ enrollments }: EnrollmentListProps) {
    return (
        <Fragment>
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Студенты</h2>
                <Badge variant="outline">{enrollments.length}</Badge>
            </div>
            <div className="space-y-3 mt-2">
                {
                    sorted(enrollments, 'progress')
                        .map(enrollment => 
                            <EnrollmentCard key={enrollment.userID} enrollment={enrollment}/>
                        )
                }
            </div>
        </Fragment>
    )
}