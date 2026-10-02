import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import ROUTES from "../routes";
import { useCurrentUser } from "../providers/current-user-provider";

export const AuthGuard: FC<PropsWithChildren> = ({children}) => {
    const {user} = useCurrentUser()

    if (!user) return <Navigate to={ROUTES.loginPage} replace />

    return children
}
