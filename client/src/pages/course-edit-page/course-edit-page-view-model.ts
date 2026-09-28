import { contentApi } from "@/entities/content/api"
import { useMutation, useQuery } from "@/shared/lib/compose"
import { Routes } from "@/shared/lib/routes-constants"
import { Bind } from "fluent-future"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


type CourseTopicsPageVM = {
    courseID: string
}


export const useCourseEditPageVM = ({courseID}: CourseTopicsPageVM) => {
    const navigate = useNavigate()

    const { data, error } = useQuery({
        query: () => Bind({
            topics: contentApi.getTopicsByCourse(courseID),
            course: contentApi.getCourseByID(courseID)
        }),
        tags: 'editable-course'
    })


    const {mutate: topicActivateMutate} = useMutation({
        mutation: contentApi.activateTopic,
        refetches: 'editable-course',
        onSuccess: () => toast("Успешно активировано")
    })


    const {mutate: topicArchiveMutate} = useMutation({
        mutation: contentApi.archiveTopic,
        refetches: 'editable-course',
        onSuccess: () => toast('Усешно архивировано')
    })


    const onTopicActivate = (topicID: string) => () => topicActivateMutate(topicID)

    const onTopicArchive = (topicID: string) => () => topicArchiveMutate(topicID)

    const onTopicSelect = (topicID: string) => () => navigate(Routes.topicEditPage(topicID))

    const onCourseStatsSelect = () => navigate(Routes.courseStaticticsPage(courseID))

    
    return {
        data, 
        error,
        onTopicActivate, 
        onTopicArchive,
        onTopicSelect,
        onCourseStatsSelect
    }
}