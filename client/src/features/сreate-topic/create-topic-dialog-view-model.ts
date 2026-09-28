import { contentApi } from "@/entities/content/api";
import type { ApiError } from "@/shared/errors";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, {object, string } from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { useMutation } from "@/shared/lib/compose";


type CreateTopicDialogVMProps = {
    onOpenChange: (open: boolean) => void
    courseID: string
}


const formShema = object({
    title: string()
        .min(8, 'Минимум 8 символов')
        .max(64, 'Маскимум 64 символа'),
    description: string()
        .min(8, 'Минимум 8 символов')
        .max(64, 'Маскимум 64 символа'),
    accessType: z.enum(['free', 'afterPrevious'], 'Неверный тип доступа')
})


export const useCreateTopicDialogVM = ({courseID, onOpenChange}: CreateTopicDialogVMProps) => {    
    const {
        control,
        formState: {errors},
        reset
    } = useForm({resolver: zodResolver(formShema)})


    const { mutate, isPending } = useMutation({
        mutation: contentApi.createTopic,
        refetches: 'editable-course',
        onSuccess: ()=> {
            toast.success('Тема успешно создана')
            onOpenChange(false)
            reset()
        },
        onError: (error: ApiError) => {
            toast.error('Ошибка при создании темы', { description: error.message })
            control.setError('root', { message: error.message })
        }
    })


    const onSubmit = control.handleSubmit(data=> mutate({...data, courseID}))

    
    return {
        errors,
        onSubmit,
        isPending,
        control
    }
}