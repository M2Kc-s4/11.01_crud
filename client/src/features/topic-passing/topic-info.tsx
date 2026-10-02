import { useMutation, useQuery } from "@/shared/lib/useQuery";
import { Button } from "@/shared/ui/button";
import { topicPassingApi } from "./api";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { Spinner } from "@/shared/ui/spinner";
import QuestionCard from "./question-card";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/app/routes";
import { CheckCircle, Loader2 } from "lucide-react";


function useViewModel(topicID: string) {
    const navigate = useNavigate()
    const [userAnswers, setAnswers] = useState<Record<string, string[]>>({})

    const { data: questions, error } = useQuery({
        query: () => topicPassingApi.startTopic(topicID)
    })


    const { mutate: completeTopic, isPending: isCompliting } = useMutation({
        mutation: topicPassingApi.completeTopic,
        onSuccess(enrollment) {
            navigate(ROUTES.enrollmentPage(enrollment.id))
        },
        onError(error) {
            toast.error('Ошибка при завершении', {description: error.message})
        }
    })


    const onAnswerSelect = (questionID: string) => (answerID: string) => () => {
        setAnswers(prev => {
            const current = prev[questionID] ?? []
            return {
                ...prev,
                [questionID]: current.includes(answerID) 
                    ? current.filter(id => id !== answerID)
                    : [...current, answerID]
            }
        })
    }

    const allAnswered = questions?.every(question => userAnswers[question.id]?.length) ?? false

    const onTopicComplete = () => {
        if (!allAnswered) {
            toast.error("Вы ответили не на все вопросы")
            return
        }

        completeTopic(topicID, userAnswers)
    }


    return {
        questions,
        error,
        userAnswers, 
        onAnswerSelect,
        onTopicComplete,
        allAnswered,
        isCompliting
    }
}


type TopicInfoProps = {
    topicID: string
}

export default function TopicInfo({ topicID }: TopicInfoProps) {
    const { 
        questions, error,
        onAnswerSelect,
        onTopicComplete,
        userAnswers,
        isCompliting,
        allAnswered
    } = useViewModel(topicID)

    if (error) return <ErrorFallback message={error.message} />
    if (!questions) return <Spinner />


    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Прохождение темы</h1>
                <p className="text-muted-foreground">
                    Выберите один или несколько вариантов ответа в каждом вопросе
                </p>
            </div>

            <div className="space-y-6">
                {
                    questions.map((question, index) => 
                        <QuestionCard 
                            question={question}
                            userAnswers={userAnswers}
                            onAnswerSelect={onAnswerSelect(question.id)}
                            number={index + 1}
                        />
                    )
                }
            </div>

            <div className="mt-8 flex justify-end">
                <Button
                    onClick={onTopicComplete}
                    disabled={!allAnswered || isCompliting}
                    className="gap-2"
                >
                    {isCompliting 
                        ?   <Loader2 className="h-4 w-4 animate-spin" />
                        :   <CheckCircle className="h-4 w-4" />
                    }
                    Завершить тему
                </Button>
            </div>
        </div>
    )
}