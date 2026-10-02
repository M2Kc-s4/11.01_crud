import { useMutation, useQuery } from "@/shared/lib/useQuery"
import { useNavigate } from "react-router-dom"
import { courseEditApi } from "./api"
import { toast } from "sonner"
import ROUTES from "@/app/routes"
import { ErrorFallback } from "@/shared/ui/error-fallback"
import { Spinner } from "@/shared/ui/spinner"
import { sorted } from "@/shared/lib/utils"
import TopicCard from "./topic-card"
import { useState } from "react"
import { CreateTopicDialog } from "../сreate-topic/create-topic-dialog"
import CreateTopicButton from "../сreate-topic/create-topic-button"


type TopicListProps = {
    courseID: string
}


function useViewModel(courseID: string) {
    const navigate = useNavigate()

    const { data: topics, error } = useQuery({
        query: () => courseEditApi.getTopicsByCourse(courseID),
        tags: 'topics'
    })


    const {mutate: topicActivateMutate} = useMutation({
        mutation: courseEditApi.activateTopic,
        refetches: 'topics',
        onSuccess: () => toast("Успешно активировано")
    })


    const {mutate: topicArchiveMutate} = useMutation({
        mutation: courseEditApi.archiveTopic,
        refetches: 'topics',
        onSuccess: () => toast('Усешно архивировано')
    })


    const onTopicActivate = (topicID: string) => () => topicActivateMutate(topicID)

    const onTopicArchive = (topicID: string) => () => topicArchiveMutate(topicID)

    const onTopicSelect = (topicID: string) => () => navigate(ROUTES.topicEditPage(topicID))

    
    return {
        topics, 
        error,
        onTopicActivate, 
        onTopicArchive,
        onTopicSelect,
    }
}


export default function TopicList({courseID}: TopicListProps) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const {
        topics, error,
        onTopicActivate,
        onTopicArchive,
        onTopicSelect
    } = useViewModel(courseID)


    if (error) return <ErrorFallback message={error.message} />
    if (!topics) return <Spinner />


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Темы курса</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreateTopicDialog 
                    open={dialogOpen} 
                    onOpenChange={setDialogOpen}
                    courseID={courseID}
                />
                <CreateTopicButton onClick={() => setDialogOpen(true)} />
                    
                {sorted(topics, 'number').map(topic => (
                    <TopicCard
                        key={topic.id}
                        topic={topic}
                        onActivate={onTopicActivate(topic.id)}
                        onArchive={onTopicArchive(topic.id)}
                        onOpen={onTopicSelect(topic.id)}
                    />
                ))}
            </div>
        </div>
    )
}