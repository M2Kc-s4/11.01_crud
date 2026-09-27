import { contentApi } from "@/entities/content/api"
import { useMutation, useQuery } from "@/shared/lib/compose"
import { QueryKeys } from "@/shared/lib/query-keys"
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
        tags: [
            QueryKeys.courseTopics(courseID),
            QueryKeys.course(courseID)
        ],
    })


    const {mutate: topicActivateMutate} = useMutation({
        mutation: contentApi.activateTopic,
        onSuccess() {
            toast("Успешно активировано")
        },
        invalidates: [QueryKeys.courseTopics(courseID)]
    })


    const {mutate: topicArchiveMutate} = useMutation({
        mutation: contentApi.archiveTopic,
        onSuccess() {
            toast('Усешно архивировано')
        },
        invalidates: [QueryKeys.courseTopics(courseID)]
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