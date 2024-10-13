import { Box, CircularProgress } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
// import { useLogoutMutation } from "services";
import { api } from "../../AxiosInstants";
import { useAuthValidator } from "../../store";
interface ApiError extends Error {
    response: { status?: number }

}
export const AuthGuard = ({ children, url, requiresAuth }: { children: JSX.Element, url: string, requiresAuth: boolean }) => {
    const { isAuthenticate, handleAuthenticate,  handleUserDetails } = useAuthValidator((state: { isAuthenticate: boolean, handleAuthenticate: (value: boolean) => void,  handleUserDetails: (value: { [key: string]: string }) => void }) => state)
    const data = useQuery({
        queryKey: ['auth/check-user'],
        queryFn: async () => {
            try {
                const { data } = await api.get('auth/check-user')                
                handleAuthenticate(data._payload?.isAuthenticate)
                handleUserDetails(data?._payload?.user_details)
                return data
            } catch (err) {
                console.error(err as unknown);
                const apiError = err as ApiError
                if (apiError?.response?.status == 401) {
                    localStorage.clear()
                    handleAuthenticate(false)
                } else if (apiError?.response?.status == 501) {
                    localStorage.clear()
                    handleAuthenticate(false)
                    // mutation.mutate()
                } else if (apiError?.response?.status == 400) {
                    localStorage.clear()
                    handleAuthenticate(false)
                    // mutation.mutate()
                } else if (apiError?.response?.status == 500) {
                    localStorage.clear()
                    handleAuthenticate(false)
                    // mutation.mutate()
                }
            }
        },
        enabled: requiresAuth == true
    })
    if (data.isLoading) {
        return <Box sx={{
            display: 'flex',
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <CircularProgress size="md" />
        </Box>
    }

    if (requiresAuth && !isAuthenticate) {
        return <Navigate to={url} />;
    }

    if (!requiresAuth && isAuthenticate) {
        return <Navigate to={url} />;
    }

    return children;
};

