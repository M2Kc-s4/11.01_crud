import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { ErrorMessage } from "@/shared/ui/form-error-message"
import { Spinner } from "@/shared/ui/spinner"
import z, { object, string } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@/shared/lib/useQuery"
import { registrationApi } from "./api"
import { toast } from "sonner"


const registerForm = object({
    name: string()
        .nonempty("Это поле обязательно")
        .min(8, "Слишком короткое имя")
        .max(32, "Слишком длинное имя"),

    telegramLink: string()
        .nonempty("Это поле обязательно")
        .min(13, "Слишком короткая ссылка"),

    password: string()
        .nonempty("Это поле обязательно")
        .min(8, "Слишком короткий пароль"),

    passwordRepeat: string()
        .nonempty("Это поле обязательно")
        .min(8, "Слишком короткий пароль")
})
.refine(
    data => data.password === data.passwordRepeat, 
    {
        error: "Пароли не совпадают",
        path: ['passwordRepeat']
    }
)


function useViewModel() {
    const {register, setError, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(registerForm)
    })


    const {isPending, mutate} = useMutation({
        mutation: ({passwordRepeat, ...data}: z.infer<typeof registerForm>) =>
            registrationApi.register(data),

        onSuccess: user =>
            toast(`Пользователь с именем ${user.username} зарегистрирован.`),

        onError: err =>
            setError("root", {message: err.message})
    })

    const onSubmit = handleSubmit(mutate)

    return {
        errors,
        onSubmit,
        register,
        isPending
    }
}


export default function RegistratinForm() {
    const {
        register,
        onSubmit,
        errors,
        isPending
    } = useViewModel()

    return (
        <Card className="max-w-md">
            <CardHeader className="text-center">
                <CardTitle>Регистрация</CardTitle>
                <CardDescription>
                    Зарегистрировать новую учетную запись
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
                    <div className="grid gap-1">
                        <Label htmlFor="name">Имя пользователя:</Label>
                        <Input {...register('name')} /> 
                        <ErrorMessage error={errors.name} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="telegram_link">Ссылка на телеграм:</Label>
                        <Input {...register('telegramLink')}/>
                        <ErrorMessage error={errors.telegramLink} />
                    </div>
            
                    <div className="grid gap-x-2 grid-cols-2 items-baseline">
                    
                        <div className="grid gap-1">
                            <Label>Пароль:</Label>
                            <Input {...register('password')} />
                            <ErrorMessage error={errors.password} />
                        </div>
                    
                        <div className="grid gap-1">
                            <Label>Повтор пароля:</Label>
                            <Input {...register('passwordRepeat')}/>
                            <ErrorMessage error={errors.passwordRepeat} />
                        </div>
                    
                    </div>
            
                    <Button type="submit" disabled={isPending} >{isPending ? <Spinner /> : "Зарегистрироваться"}</Button>
                    <ErrorMessage error={errors.root} />
            
                </form>
            </CardContent>
        </Card>
    )
}
