import { useParam } from "@/shared/lib/useParam";
import QuestionList from "./question-list";
import TopicInfo from "./topic-info";

export default function EditTopicPage() {
    const topicID = useParam("topicID")

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <TopicInfo topicID={topicID} />
            <QuestionList topicID={topicID} />
        </div>
    )
}