import { useQuery } from "@/shared/lib/useQuery";
import { HelpCircle } from "lucide-react";
import { topicEditApi } from "./api";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import QuestionCard from "./question-card";
import { Card, CardContent } from "@/shared/ui/card";


function useViewModel(topicID: string) {
    const { data: questions, error } = useQuery({
        query: () => topicEditApi.getQuestionsByTopic(topicID),
        tags: 'questions'
    })

    return {
        questions,
        error
    }
}


type QuestionListProps = {
    topicID: string
}


export default function QuestionList({topicID}: QuestionListProps) {
    const { questions, error } = useViewModel(topicID)

    if (error) return <ErrorFallback message={error.message} />
    if (!questions) return <Spinner />


    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Вопросы ({questions.length})
            </h2>

            {questions.length
                ?   <div className="grid gap-3">
                        {questions.map(question => 
                            <QuestionCard 
                                key={question.id} question={question}
                            />    
                        )}
                    </div>
                :   <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            В этой теме пока нет вопросов
                        </CardContent>
                    </Card> 
            }
        </div>
    )
}