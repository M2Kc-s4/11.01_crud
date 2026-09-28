import  { useForm } from "react-hook-form"
import { api } from "@/shared/api/query-client"
import {useNavigate} from 'react-router-dom'
import { useCurrentUser } from "@/entities/identity/providers/current-user-provider"
import { userApi } from "@/entities/identity/api"
import { useMutation } from "@/shared/lib/compose"
import { object, string } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"


const formShema = object({
    password: string()
        .nonempty('Это поле обязательно')
        .min(8, 'Слишком короткий пароль'),
    username: string()
        .nonempty('Это поле обязательно')
        .min(8, 'Слишком которкое имя')
})


export const useLoginFormVM = () => {
    const { updateCurrentUser } = useCurrentUser()
    const navigate = useNavigate()


    const {
        setError,
        register,
        handleSubmit,
        formState: {errors}, 
    } = useForm({resolver: zodResolver(formShema)})


    const {mutate, isPending} = useMutation({
        mutation: data => userApi
            .login(data)
            .map(({accessToken}) => accessToken)
            .tap(api.setBearer)
            .andThen(updateCurrentUser),

        onSuccess: () => {
            navigate('/')
        },

        onError: err => {
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