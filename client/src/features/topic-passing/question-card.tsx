import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import type { AnswerRead, QuestionRead } from "@contracts"


type QuestionCardProps = {
    question: QuestionRead,
    number: number,
    userAnswers: Record<string, string[]>,
    onAnswerSelect: (answerID: string) => () => void
}


export default function QuestionCard({ question, number, userAnswers, onAnswerSelect }: QuestionCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-start gap-2">
                    <span className="text-primary font-bold">{number}.</span>
                    {question.text}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {
                        question.answers.map(answer => {
                            const checked = userAnswers[question.id]?.includes(answer.id) ?? false

                            return (
                                <AnswerCard 
                                    checked={checked} 
                                    answer={answer} 
                                    onAnswerSelect={onAnswerSelect(answer.id)} 
                                />
                            )
                        })
                    }
                </div>
            </CardContent>
        </Card>
    )
}


type AnswerCardProps = {
    answer: AnswerRead,
    checked: boolean,
    onAnswerSelect: () => void
}

function AnswerCard({ answer, checked, onAnswerSelect }: AnswerCardProps) {
    return (
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
            <Checkbox 
                checked={checked}
                onCheckedChange={onAnswerSelect}
            />
            <Label
                className="cursor-pointer flex-1 py-1 text-sm font-normal"
            >
                {answer.text}
            </Label>
        </div>
    )
}