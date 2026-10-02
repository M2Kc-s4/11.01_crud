import { sorted } from "@/shared/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent } from "@/shared/ui/card"
import { Progress } from "@/shared/ui/progress"
import type { EnrollmentRead, TopicEnrollmentRead } from "@contracts"
import { User } from "lucide-react"

type EnrollmentCardProps = {
    enrollment: EnrollmentRead
}

export default function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
    const progress = enrollment.progress / enrollment.topicsCount * 100 || 0

    return (
        <Card>
            <CardContent className="p-4">
                <Accordion type='single' collapsible>
                    <AccordionItem value={enrollment.userID} >
                        <AccordionTrigger className="py-0">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{enrollment.username}</span>
                                </div>
                                <Badge className="mr-2" variant={progress === 100 ? "default" : "secondary"}>
                                    {progress}%
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 z-10 pt-3">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Курс</p>
                                <Progress value={progress} />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {enrollment.progress} / {enrollment.topicsCount} тем
                                </p>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs font-medium mb-2">По темам</p>
                                <div className="space-y-2">
                                    {
                                        sorted(enrollment.topicEnrollments, 'number')
                                            .map(t => 
                                                <StudentTopicStatsCard topicEnrollment={t}/>
                                            )
                                    }
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>    
            </CardContent>
        </Card>
    )
}



type StudentTopicCardProps = {
    topicEnrollment: TopicEnrollmentRead
}

function StudentTopicStatsCard({topicEnrollment}: StudentTopicCardProps) {
    const percent = (topicEnrollment.completedQuestions / topicEnrollment.questionCount * 100) || 0

    return (
        <div key={topicEnrollment.id}>
            <div className="flex items-center justify-between mb-0.5">
                <p className="text-xs">
                    Тема {topicEnrollment.number}
                    {topicEnrollment.isCompleted && " ✓"}
                </p>
                <span className="text-xs text-muted-foreground">
                    {topicEnrollment.completedQuestions}/{topicEnrollment.questionCount} Вопросов
                </span>
            </div>
            <Progress value={percent} className="h-1.5" />
        </div>
    )
}