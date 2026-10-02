import { useQuery } from "@/shared/lib/useQuery";
import { List } from "lucide-react";
import { coursePreviewApi } from "./api";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import { sorted } from "@/shared/lib/utils";
import TopicCard from "./topic-card";

type TopicListProps = {
    courseID: string
}


function useViewModel(courseID: string) {
    const { data: topics, error } = useQuery({
        query: () => coursePreviewApi.getTopicsByCourse(courseID)
    })

    return {
        topics,
        error
    }
}


export default function TopicList({ courseID }: TopicListProps) {
    const { topics, error } = useViewModel(courseID)

    if (error) return <ErrorFallback message={error.message} />
    if (!topics) return <Spinner />


    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
                <List className="h-5 w-5" />
                Темы курса
            </h2>
            <div className="grid gap-3">
                {
                    sorted(topics, 'number')
                        .map(topic => <TopicCard topic={topic} key={topic.id} />)
                }
            </div>
        </div>
    )
}