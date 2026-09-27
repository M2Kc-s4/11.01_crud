import { useNavigate } from 'react-router-dom';
import { learningApi } from '@/entities/learning/api';
import { QueryKeys } from '@/shared/lib/query-keys';
import { useState } from 'react';
import { toast } from 'sonner';
import { Routes } from '@/shared/lib/routes-constants';
import { useMutation, useQuery } from '@/shared/lib/compose';

type TopicPassingPageVMProps = {
    topicID: string
}

export const useTopicPassingPageVM = ({ topicID }: TopicPassingPageVMProps) => {
    const navigate = useNavigate()    

    const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string[]>>({})

    
    const { data: questionsToAnswer, error } = useQuery({
        tags: [QueryKeys.topicQuestionsToPass(topicID)],
        query: () => learningApi.startTopic(topicID),
    })

    
    const { mutate: completeTopic, isPending: isSubmitting } = useMutation({
        mutation: learningApi.completeTopic,
        onSuccess: (enrollment) => {
            navigate(Routes.enrollmentPage(enrollment.id))
        },
        onError: () => {
            toast.error('Не удалось отправить ответы')
        },
        invalidates: enrollment => [
            QueryKeys.enrollment(enrollment.id),
            QueryKeys.enrollmentTopics(enrollment.id),
            QueryKeys.enrollmentsMe
        ]
    })


    const handleAnswerChange = (questionId: string, answerId: string) => () => {
        setAnsweredQuestions(prev => {
            const currentAnswers = prev[questionId] || []
            
            const updatedAnswers = currentAnswers.includes(answerId)
                ? currentAnswers.filter(id => id !== answerId)
                : [...currentAnswers, answerId]

            return {
                ...prev,
                [questionId]: updatedAnswers,
            }
        })
    }

    const isAllAnswered = questionsToAnswer?.every(q => answeredQuestions[q.id]?.length > 0) ?? false

    const handleSubmit = () => {
        if (isAllAnswered) {
            completeTopic({
                topicID,
                questions: Object.entries(answeredQuestions)
                    .map(([questionID, selectedAnswers]) => ({
                        id: questionID, 
                        selectedAnswers: selectedAnswers
                    }))
            })
        } else {
            toast.error("Вы ответили не на все вопросы")
        }
    }

    return {
        questionsToAnswer,
        error,
        isSubmitting,
        answeredQuestions,
        handleAnswerChange,
        isAllAnswered,
        handleSubmit,
    }
}
