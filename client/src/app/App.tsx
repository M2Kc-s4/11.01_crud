import { BrowserRouter } from "react-router-dom"
import { RegisteredRoutes } from "./routes"
import { Toaster } from "sonner"
import { CurrentUserProvider } from "@/entities/identity/providers/current-user-provider"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { LoadingProvider, useLoading } from "@/shared/providers/loading-provider"
import type { FC, PropsWithChildren } from "react"
import { Spinner } from "@/shared/ui/spinner"
import { QueryRegistryProvider } from "@/shared/lib/compose"


function App() {
    return (
        <Composition>
            <View/>
        </Composition>
    )
}

const Composition: FC<PropsWithChildren> = ({children}) =>
<ThemeProvider>
    <LoadingProvider>
        <QueryRegistryProvider>
            <BrowserRouter>
                <CurrentUserProvider>
                    {children}
                    <Toaster position='top-right' />
                </CurrentUserProvider>
            </BrowserRouter>
        </QueryRegistryProvider>
    </LoadingProvider>
</ThemeProvider>


const View = () => {
    const {isLoading} = useLoading()

    if (isLoading) return <Spinner/>

    return <RegisteredRoutes/>
}

export default App