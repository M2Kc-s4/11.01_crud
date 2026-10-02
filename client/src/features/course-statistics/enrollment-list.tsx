import type { EnrollmentRead } from "@contracts";
import { Fragment } from "react/jsx-runtime";
import EnrollmentCard from "./enrollment-card";
import { sorted } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { BadgeQuestionMark } from "lucide-react";

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
                    enrollments.length
                        ?   sorted(enrollments, 'progress')
                                .map(enrollment => <EnrollmentCard key={enrollment.userID} enrollment={enrollment}/>)
                        :   <EmptyState icon={BadgeQuestionMark} title="На курс не записан ни один студент" />
                }
            </div>
        </Fragment>
    )
}