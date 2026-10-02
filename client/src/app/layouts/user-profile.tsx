import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/shared/ui/badge"
import { LogOut, Shield, User } from "lucide-react"
import { ThemeSwitcher } from "@/shared/ui/theme-switcher"
import { CopyableSpan } from "@/shared/ui/copyable-span"
import { useGuardedCurrentUser } from "@/app/providers/current-user-provider"
import { getInitials } from "@/shared/lib/utils"
import ROUTES from "@/app/routes"


export default function UserProfile() {
    const navigate = useNavigate()
    const { user, logout } = useGuardedCurrentUser()

    const initials = getInitials(user.username)
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="avatar-fallback text-amber-100">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>


            <DropdownMenuContent className="w-64 " align="end">
                <DropdownMenuLabel className="p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-blue-100">
                            <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        
                        <CopyableSpan value={user.username} className="text-lg" />
                    </div>

                    <CopyableSpan value={user.telegramLink} />

                    <div className="flex flex-wrap gap-2 mt-1">
                        {user.roles.map(role => role === 'Student'
                        ?   <Badge 
                                key={role} 
                                variant='destructive'
                                className="text-xs"
                            >
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    Студент
                                </div>
                            </Badge>
                        :  <Badge 
                                key={role} 
                                variant='default'
                                className="text-xs"
                            >
                                <div className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" /> 
                                    Преподаватель
                                </div>
                            </Badge>  
                        )}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                    className="cursor-pointer py-3 text-red-600 focus:text-red-600"
                    onClick={() => logout().tap(() => navigate(ROUTES.loginPage))}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Выйти</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>
                    <ThemeSwitcher />
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}