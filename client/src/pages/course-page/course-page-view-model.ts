import { contentApi } from '@/entities/content/api';
import { learningApi } from '@/entities/learning/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Bind } from 'fluent-future';
import { useGuardedCurrentUser } from '@/entities/identity/providers/current-user-provider';
import { Routes } from '@/shared/lib/routes-constants';
import { useMutation, useQuery } from '@/shared/lib/compose';

type CoursePageVMProps = {
    courseID: string
}


export const useCoursePageVM = ({ courseID }: CoursePageVMProps) => {
    const navigate = useNavigate()
    const {user} = useGuardedCurrentUser()


    const {data: courseData, error} = useQuery({
        query: () => Bind({
            course: contentApi.getCourseByID(courseID),
            topics: contentApi.getTopicsByCourse(courseID),
            enrollment: learningApi.getUserEnrollmentByCourse(courseID, user.id)
        }),
    })


    const {mutate: enrollCourse, isPending} = useMutation({
        mutation: learningApi.enrollCourse,
        onError: err => toast(err.message),
        onSuccess: enrollment => {
            toast.success('Вы подписались на курс')
            navigate(Routes.enrollmentPage(enrollment.id))
        },
    })

    const onEnrollmentSelect = (enrollmentID: string) => () => navigate(Routes.enrollmentPage(enrollmentID))

    const onCourseEnroll = () => enrollCourse(courseID)


    return {
        onCourseEnroll,
        isPending,
        courseData,
        error,
        onEnrollmentSelect
    }
}