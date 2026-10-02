import type { UserRead } from "@contracts";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { ApiError } from "@/shared/errors";
import { Future } from 'fluent-future';
import { api } from "@/shared/query-client";
import { useLoading } from "@/app/providers/loading-provider";
import { authorizationApi } from "@/features/authorizarion/api";


type CurrentUserContextType = {
    user: UserRead | null,
    updateCurrentUser: () => Future<UserRead, ApiError>,
    logout: () => Future<void>
}


const CurrentUserContext = createContext<CurrentUserContextType | null>(null)


export default function CurrentUserProvider({children}: PropsWithChildren) {
    const [user, setUser] = useState<UserRead | null>(null)
    const {toggleLoadingOff, toggleLoadingOn} = useLoading()
    

    const updateCurrentUser = useCallback(() => 
        Future.of<void, ApiError>(toggleLoadingOn)
            .andThen(authorizationApi.getCurrent)
            .tap(setUser)
            .tapErr(console.log)
            .finally(toggleLoadingOff)
    , [toggleLoadingOff, toggleLoadingOn])


    const logout = useCallback(() => 
        Future.of<void, ApiError>(toggleLoadingOn)
            .andThen(authorizationApi.logout)
            .tap(() => {
                setUser(null)
                api.removeBearer()
            })
            .finally(toggleLoadingOff)
    , [toggleLoadingOff, toggleLoadingOn])


    useEffect(() => {
        updateCurrentUser()
    }, [updateCurrentUser])


    const currentUserValue = useMemo(()=> ({
        user,
        updateCurrentUser,
        logout,
    }), [user, updateCurrentUser, logout])

    return (
        <CurrentUserContext.Provider value={currentUserValue}>
            {children}
        </CurrentUserContext.Provider>
    )
}


export function useCurrentUser() {
    const ctx = useContext(CurrentUserContext)
    if (!ctx) throw new Error('useCurrentUser must be used within UserProvider')
    return ctx
}


export function useGuardedCurrentUser() {
    const {user, logout, updateCurrentUser} = useCurrentUser()

    if (!user) throw new Error('useGuardedCurrentUser must be used within AuthGuard')

    return {logout, updateCurrentUser, user}
}