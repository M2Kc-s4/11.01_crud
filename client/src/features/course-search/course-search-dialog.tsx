import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { DotsSpinner } from '@/shared/ui/spinner';
import { EmptyState } from '@/shared/ui/empty-state';
import { useQuery } from '@/shared/lib/useQuery';
import { courseSearchApi } from './api';
import CourseSearchResult from './course-search-result';
import ROUTES from '@/app/routes';
import { useSearch } from '@/app/providers/search-context';
import { useDebouncedValue } from '@/shared/lib/usedebouncedValue';


function useViewModel() {
    const { isOpen, close } = useSearch()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')

    const debouncedQuery = useDebouncedValue(query, 300)


    const { data: courses, isFetching } = useQuery({
        query: () => courseSearchApi.searchCourses(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
        deps: [debouncedQuery],
    })


    useEffect(() => {
        if (!isOpen) setQuery('')
    }, [isOpen])


    const handleSelect = (courseId: string) => {
        close()
        navigate(ROUTES.coursePage(courseId))
    }

    return {
        courses, 
        isFetching,
        handleSelect,
        isOpen, 
        setQuery,
        close,
        query
    }
}


export default function CourseSearchDialog() {
    const { 
        courses, handleSelect, 
        isFetching, isOpen, 
        close, setQuery, query
    } = useViewModel()    

    
    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="p-0 gap-0 w-[90vw] max-w-2xl top-[20%] translate-y-0">
                <DialogHeader className="px-6 pt-5 pb-4 border-b">
                    <DialogTitle className="text-lg">Поиск курсов</DialogTitle>
                </DialogHeader>

                <div className="relative px-6 py-4">
                    <Search className="absolute left-9 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    
                    <Input
                        autoFocus
                        placeholder="Введите название курса..."
                        className="h-10 text-base pl-10 pr-20 border-0 focus-visible:ring-0 shadow-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    
                    <div className="absolute right-9 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {
                            isFetching &&
                                <DotsSpinner className="w-5 h-5" />
                        }
                        {
                            query &&
                                <button onClick={() => setQuery('')}>
                                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </button>
                        }
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto border-t">
                {   
                    query.length < 2 
                        ?   <div className="py-16 text-center text-sm text-muted-foreground">
                                Введите минимум 2 символа для поиска
                            </div>
                        :   !courses?.length 
                                ?   <EmptyState
                                        icon={Search}
                                        title="Ничего не найдено"
                                        description={`По запросу «${query}» курсов нет`}
                                        className="py-16"
                                    />
                                :   <div className="py-3">
                                        {
                                            courses.map(course => 
                                                <CourseSearchResult
                                                    key={course.id}
                                                    course={course}
                                                    onSelect={() => handleSelect(course.id)}
                                                />
                                            )
                                        }
                                    </div>
                }
                </div>

                <div className="flex items-center gap-5 px-6 py-3 border-t text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px] font-mono">↑↓</kbd>
                        навигация
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px] font-mono">↵</kbd>
                        выбрать
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px] font-mono">esc</kbd>
                        закрыть
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    )
}