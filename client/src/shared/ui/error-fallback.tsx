import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '@/shared/lib/utils';

type ErrorFallbackProps = {
    message?: string
    title?: string
    onRetry?: () => void
    action?: ReactNode
    className?: string
}

export function ErrorFallback({
    message = 'Что-то пошло не так',
    title = 'Ошибка',
    onRetry,
    action,
    className,
}: ErrorFallbackProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >

        <div className="p-3 bg-destructive/10 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {message}
        </p>

        <div className="mt-4 flex gap-2">
            {
                onRetry && 
                    <Button variant="outline" onClick={onRetry}>
                        Попробовать снова
                    </Button>
            }
            {action}
        </div>
        </div>
    )
}