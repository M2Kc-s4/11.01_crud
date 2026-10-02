import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Badge } from "@/shared/ui/badge";
import type { EnrollmentRead } from "@contracts";
import TopicCard from "./topic-card";
import { GitCommitVerticalIcon } from "lucide-react";
import { useQuery } from "@/shared/lib/useQuery";
import { enrollmentManageApi } from "./api";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/app/routes";
import { sorted } from "@/shared/lib/utils";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";

type TopicListProps = {
    enrollment: EnrollmentRead
}


function useViewModel(courseID: string) {
    const navigate = useNavigate()

    const { data: topics, error } = useQuery({
        query: () => enrollmentManageApi.getTopicsByCourse(courseID)
    })

    const onTopicSelect = (topicID: string) => () => navigate(ROUTES.topicPassingPage(topicID))

    return {
        onTopicSelect,
        topics,  
        error
    }
}


export default function TopicList({ enrollment }: TopicListProps) {
    const { topics, error, onTopicSelect } = useViewModel(enrollment.courseID)

    if (error) return <ErrorFallback message={error.message} />
    if (!topics) return <Spinner />

    return (
        <Accordion defaultValue="topics" type="single" collapsible className="w-full">
            <AccordionItem value="topics">
                <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">Темы курса</h2>
                        <Badge variant="outline" className="px-2 py-0.5">
                            {topics.length}
                        </Badge>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-3 mt-2 overflow-y-scroll">
                        {sorted(topics, 'number')
                            .map((topic, index) => 
                                <>
                                    {
                                        index && 
                                            <div className="p-0 m-0 ml-3.5 flex justify-center items-center w-fit h-7.5 overflow-hidden">
                                                <GitCommitVerticalIcon size={40} />
                                            </div>
                                    }
                                    <TopicCard
                                        topic={topic}
                                        key={topic.id}
                                        enrollment={enrollment}
                                        onSelect={onTopicSelect(topic.id)}
                                    />
                                </>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}