import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CustomError } from "../../types";
import { useAuthValidator } from "../../store";
import { useNavigate } from "react-router-dom";
import { urls } from "../../routers/urls";




export function useSignUpMutation() {
    const { handleAuthenticate, handleUserDetails } = useAuthValidator((state: { handleAuthenticate: (value: boolean) => void, handleUserDetails: (value: { [key: string]: string }) => void }) => state)
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (newTodo: { name: string }) => {
            return axios.post(`${import.meta.env.VITE_BASE_URL}/auth/sign-up`, newTodo,)
        },
        onSuccess({ data }) {
            const { accessToken, refreshToken, _id, isAuthenticate, ...rem } = data?._payload
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('user', _id)
            localStorage.setItem("isAuthenticate", isAuthenticate)
            handleAuthenticate(isAuthenticate)
            handleUserDetails({ ...rem, _id })
            navigate(urls.BASE_URL)
        },
        onError: ({ response }: CustomError) => {
            console.log(response);
        }
    })
}
export function useSignInMutation() {
    const { handleAuthenticate, handleUserDetails } = useAuthValidator((state: { handleAuthenticate: (value: boolean) => void, handleUserDetails: (value: { [key: string]: string }) => void }) => state)
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (newTodo: { name: string }) => {
            return axios.post(`${import.meta.env.VITE_BASE_URL}/auth/sign-in`, newTodo,)
        },
        onSuccess({ data }) {
            const { accessToken, refreshToken, _id, isAuthenticate, ...rem } = data?._payload
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('user', _id)
            localStorage.setItem("isAuthenticate", isAuthenticate)
            handleAuthenticate(isAuthenticate)
            handleUserDetails({ ...rem, _id })
            navigate(urls.BASE_URL)
        },
        onError: ({ response }: CustomError) => {
            console.log(response);
        }
    })
}

