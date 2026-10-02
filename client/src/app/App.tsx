import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/app/providers/theme-provider"
import { LoadingProvider, useLoading } from "@/app/providers/loading-provider"
import type { PropsWithChildren } from "react"
import { Spinner } from "@/shared/ui/spinner"
import { QueryRegistryProvider } from "@/shared/lib/useQuery"
import Router from "./router"
import CurrentUserProvider from "./providers/current-user-provider"
import { SearchProvider } from "./providers/search-context"


function Composition({children}: PropsWithChildren) {
    return (
        <ThemeProvider>
            <LoadingProvider>
                <QueryRegistryProvider>
                    <BrowserRouter>
                        <CurrentUserProvider>
                            <SearchProvider>
                                {children}
                                <Toaster position='top-right' />
                            </SearchProvider>
                        </CurrentUserProvider>
                    </BrowserRouter>
                </QueryRegistryProvider>
            </LoadingProvider>
        </ThemeProvider>
    )
}


function View() {
    const {isLoading} = useLoading()

    if (isLoading) return <Spinner/>

    return <Router />
}


export default function App() {
    return (
        <Composition>
            <View/>
        </Composition>
    )
}