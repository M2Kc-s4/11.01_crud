import  { useForm } from "react-hook-form"
import { api } from "@/shared/api/query-client"
import type { ApiError } from "@/shared/errors"
import {useNavigate} from 'react-router-dom'
import { useCurrentUser } from "@/entities/identity/providers/current-user-provider"
import { userApi } from "@/entities/identity/api"
import { useMutation } from "@/shared/lib/compose"

export type LoginForm = {
    password: string,
    username: string
}

export const useLoginFormVM = () => {
    const { updateCurrentUser } = useCurrentUser()
    const navigate = useNavigate()


    const {
        register, 
        handleSubmit, 
        formState: {errors}, 
        setError
    } = useForm<LoginForm>()


    const {mutate, isPending} = useMutation({
        mutation: (data: LoginForm) => userApi
            .login(data)
            .map(({accessToken}) => accessToken)
            .tap(api.setBearer)
            .andThen(updateCurrentUser),

        onSuccess: () => {
            navigate('/')
        },

        onError: (err: ApiError)  => {
            if (err.status === 400) {
                setError('root' , {message: 'Неверный логин или пароль'})
            } else {
                setError('root', { message: 'Что-то пошло не так, попробуйте позже' })
            }
        }
    })


    const fields = {
        name: register('username', {
            required: 'Это поле обязательно',
            maxLength: {value: 32, message: "Слишком длинное имя"}, 
            minLength: {value: 8, message: "Слишком которкое имя"},
        }),

        password: register('password', {
            minLength: {value: 8, message: "Слишком короткий пароль"},
            required: "Это поле обязательно",
        }),
    }


    const onSubmit = handleSubmit(form => mutate(form))

    return {
        fields,
        onSubmit,
        errors,
        isPending
    }
}