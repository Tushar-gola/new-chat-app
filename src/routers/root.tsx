import { urls } from "./urls";
import { Outlet } from "react-router-dom";
import { LoadingCallBack } from "../features";
import { AuthGuard } from "../layouts";
import { ChatPage, LoginPage, SignUpPage } from "../pages";

export const root = [
    {
        path: urls.BASE_URL,
        element: <LoadingCallBack />
    },
    {
        path: urls.LOGIN,
        element: <AuthGuard url={urls.BASE_URL} requiresAuth={false}>
            <Outlet />
        </AuthGuard>,
        children: [
            {
                index: true,
                element: <LoginPage />,
            }
        ]
    },
    {
        path: urls.SIGNUP,
        element: <AuthGuard url={urls.BASE_URL} requiresAuth={false}>
            <Outlet />
        </AuthGuard>,
        children: [
            {
                index: true,
                element: <SignUpPage />,
            },
        ]
    },
    {
        path: urls.BASE_URL,
        element: <AuthGuard url={urls.LOGIN} requiresAuth={true}>
            <Outlet />
        </AuthGuard>,
        handle: {
            crumb: () => ({ label: "Home" }),
        },
        children: [
            {
                index: true,
                element: <ChatPage />,
            },
        ]

    }
]