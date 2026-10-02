import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ErrorMessage } from "@/shared/ui/form-error-message";
import { Spinner } from "@/shared/ui/spinner";
import { object, string } from "zod";
import { useCurrentUser } from "@/app/providers/current-user-provider";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@/shared/lib/useQuery";
import { authorizationApi } from "./api";
import { api } from "@/shared/query-client";
import ROUTES from "@/app/routes";


const formShema = object({
    password: string()
        .nonempty('Это поле обязательно')
        .min(8, 'Слишком короткий пароль'),
    username: string()
        .nonempty('Это поле обязательно')
        .min(8, 'Слишком которкое имя')
})


function useViewModel() {
    const { updateCurrentUser } = useCurrentUser()
    const navigate = useNavigate()


    const {
        setError,
        register,
        handleSubmit,
        formState: {errors}, 
    } = useForm({resolver: zodResolver(formShema)})


    const {mutate, isPending} = useMutation({
        mutation: data => authorizationApi
            .login(data)
            .map(({accessToken}) => accessToken)
            .tap(api.setBearer)
            .andThen(updateCurrentUser),

        onSuccess() {
            navigate(ROUTES.homepage)
        },

        onError(err) {
            if (err.status === 400) {
                setError('root' , {message: 'Неверный логин или пароль'})
            } else {
                setError('root', { message: 'Что-то пошло не так, попробуйте позже' })
            }
        }
    })

    const onSubmit = handleSubmit(mutate)

    return {
        register,
        onSubmit,
        errors,
        isPending
    }
}


export default function LoginForm() {
    const {
        errors,
        register,
        onSubmit,
        isPending
    } = useViewModel()


    return (
        <Card className="w-full max-w-sm h-fit mb-3.5">
            <form onSubmit={onSubmit}>
                <CardHeader className="text-center">
                    <CardTitle className={'text-center'}>
                        Войти в свой аккаунт
                    </CardTitle>
                    <CardDescription>
                        Войти в аккаунт используя логин и пароль
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col gap-6 mb-4">
                        <div className="grid gap-1">
                            <Label htmlFor="email">Логин</Label>
                            <Input {...register('username')}/>
                            <ErrorMessage error={errors.username} />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="password">Пароль</Label>
                            <Input {...register('password')}/>
                            <ErrorMessage error={errors.password} />
                        </div>
                    </div>
                </CardContent>

                <CardContent>
                    <Button type="submit" variant='default' disabled={isPending} className="w-full">
                        {isPending ? <Spinner /> : "Войти"}
                    </Button>
                    <ErrorMessage error={errors.root}/>
                </CardContent>
            </form>
        </Card>
    )
}
