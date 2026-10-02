import { useParam } from "@/shared/lib/useParam";
import TopicInfo from "./topic-info";

export default function TopicPassingPage() {
    const topicID = useParam('topicID')

    return <TopicInfo topicID={topicID} />
}