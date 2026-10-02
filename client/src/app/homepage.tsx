import { useGuardedCurrentUser } from "@/app/providers/current-user-provider"
import HomepageCourseList from "@/features/homepage-created-course-list/course-list"
import HomepageEnrollmentList from "@/features/homepage-enrollment-list/enrollment-list"

export default function Homepage() {
    const { user } = useGuardedCurrentUser()


    return (
        <>
            {user.roles.includes('Student') && <HomepageEnrollmentList />}

            {user.roles.includes('Teacher') && <HomepageCourseList />}
        </>
    )
}




