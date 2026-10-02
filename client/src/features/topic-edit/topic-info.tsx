import { useState } from "react";
import { CreateQuestionDialog } from "../сreate-question/create-question-dialog";
import { useQuery } from "@/shared/lib/useQuery";
import { topicEditApi } from "./api";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import { CreateQuestionDialogButton } from "../сreate-question/create-question-dialog-button";


function useViewModel(topicID: string) {
    const { data: topic, error } = useQuery({
        query: () => topicEditApi.getTopicByID(topicID)
    })

    return {
        topic,
        error
    }
}


type TopicInfoProps = {
    topicID: string
}


export default function TopicInfo({ topicID }: TopicInfoProps) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const {topic, error} = useViewModel(topicID)

    if (error) return <ErrorFallback message={error.message} />
    if (!topic) return <Spinner />

    return (
        <div className="mb-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
                    <p className="text-muted-foreground">{topic.description}</p>
                </div>
            
                <CreateQuestionDialog
                    topicID={topic.id}
                    onOpenChange={setDialogOpen}
                    open={dialogOpen}
                />    
                <CreateQuestionDialogButton onClick={() => setDialogOpen(true)} />
            </div>
        </div>
    )
}