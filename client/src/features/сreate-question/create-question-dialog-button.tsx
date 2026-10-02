import { Button } from "@/shared/ui/button"
import { Plus } from "lucide-react"

type ButtonProps = {
    onClick: () => void
}

export const CreateQuestionDialogButton = ({onClick}: ButtonProps) => {
    return (
        <Button onClick={onClick} variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Создать вопрос
        </Button>
    )
}