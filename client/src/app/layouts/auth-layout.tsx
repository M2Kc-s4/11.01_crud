import { ThemeSwitcher } from "@/shared/ui/theme-switcher"
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group"
import { Outlet, useNavigate } from "react-router-dom"
import ROUTES from "../routes"


export default function AuthLayout() {
    const navigate = useNavigate()

    return (
        <main className={'flex h-dvh justify-center items-center flex-col pb-10'}>
            <div className="max-sm:scale-100 h-fit max-w-95 flex-col flex items-center gap-2">
                <div className="grid grid-cols-3 w-full items-center justify-items-center">
                    <ToggleGroup className="col-start-2" value={''} type='single'>
                        <ToggleGroupItem onClick={() => navigate(ROUTES.loginPage)} value="auth">Авторизация</ToggleGroupItem>
                        <ToggleGroupItem onClick={() => navigate(ROUTES.registerPage)} value="reg">Регистрация</ToggleGroupItem>
                    </ToggleGroup>
                    <ThemeSwitcher/>
                </div>
                <Outlet />
            </div>
        </main>
    )
}