// features/course-search/course-search-result.tsx
import type { CourseRead } from '@contracts';
import { BookOpen, Users, PlayCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type CourseSearchResultProps = {
    course: CourseRead
    onSelect: () => void
    isSelected?: boolean
}

export default function CourseSearchResult({
    course,
    onSelect,
    isSelected,
}: CourseSearchResultProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isSelected && 'bg-accent text-accent-foreground'
            )}
        >
            <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{course.title}</span>
                </div>

                {
                    course.description && 
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {course.description}
                        </p>
                }

                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                {
                    course.createdByName && 
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course.createdByName}
                        </span>
                }
                {
                    !!course.topicsCount  && 
                        <span className="flex items-center gap-1">
                            <PlayCircle className="h-3 w-3" />
                            {course.topicsCount} тем
                        </span>
                }
                </div>
            </div>
        </button>
    )
}