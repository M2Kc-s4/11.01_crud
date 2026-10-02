import { useGuardedCurrentUser } from "@/app/providers/current-user-provider"
import { useQuery } from "@/shared/lib/useQuery"
import { useNavigate } from "react-router-dom"
import { enrollmentListApi } from "./api"
import ROUTES from "@/app/routes"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { Spinner } from "@/shared/ui/spinner"
import { Book, BookOpen } from "lucide-react"
import { Button } from "@/shared/ui/button"
import EnrollmentCard from "./enrollment-card"
import { EmptyState } from "@/shared/ui/empty-state"


function useViewModel() {
    const navigate = useNavigate()
    const { user } = useGuardedCurrentUser()

    const { data: enrollments, error } = useQuery({
        query: () => enrollmentListApi.getEnrollmentsByUser(user.id),
    })

    const onEnrollmentSelect = (enrollmentID: string) => () => navigate(ROUTES.enrollmentPage(enrollmentID))

    return {
        enrollments,
        error,
        onEnrollmentSelect
    }
}


export default function HomepageEnrollmentList() {
    const {enrollments, error, onEnrollmentSelect} = useViewModel()

    if (error) return <ErrorFallback message={error.message} />
    if (!enrollments) return <Spinner />


    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Мои курсы</h2>
                </div>
                <Button variant="ghost" size="sm">Посмотреть все →</Button>
            </div>
            {
                enrollments.length
                    ?   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                enrollments.map(enrollment => 
                                    <EnrollmentCard
                                        key={enrollment.id}
                                        enrollment={enrollment}
                                        onSelect={onEnrollmentSelect(enrollment.id)}
                                    />
                                )
                            }
                        </div>
                    :   <EmptyState icon={Book} title="У вас нету подписок" />
            }
        </section>
    )
}