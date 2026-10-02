import { Link, Outlet } from "react-router-dom";
import ROUTES from "../routes";
import UserProfile from "./user-profile";
import { useSearch } from "../providers/search-context";
import { Search } from "lucide-react";
import CourseSearchDialog from "@/features/course-search/course-search-dialog";

function Header() {
    const { open } = useSearch()

    return (
        <header className="border-b border-border bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                <Link to={ROUTES.homepage} className="flex items-center gap-2" >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        🎻
                    </div>
                    <span className="font-bold text-lg">LearnHub</span>
                </Link>

                <button
                    onClick={open}
                    className="hidden md:flex items-center gap-2 px-3 h-9 w-80 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
                >
                    <Search className="h-4 w-4 shrink-0" />
                    <span>Поиск курсов...</span>
                    <kbd 
                        className={`
                            ml-auto pointer-events-none inline-flex 
                            h-5 select-none items-center gap-1 rounded 
                            border bg-background px-1.5 font-mono 
                            text-[10px] font-medium text-muted-foreground
                        `}
                    >
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>

                <CourseSearchDialog />

                <div className="flex items-center gap-2">
                    <UserProfile />
                </div>
            </div>
        </header>
    )
}


export default function AppLayout() {
    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 space-y-12">
                <Outlet />
            </main>
        </>
    )
}