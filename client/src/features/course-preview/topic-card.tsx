import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import type { TopicRead } from "@contracts";


type TopicCardProps = {
    topic: TopicRead
}


export default function TopicCard({ topic }: TopicCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                                Тема {topic.number}
                            </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">
                            {topic.questionsCount} вопросов
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}