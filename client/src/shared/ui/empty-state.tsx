import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type EmptyStateProps = {
    icon?: LucideIcon
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >
        {Icon && 
            <div className="p-3 bg-muted rounded-full mb-4">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
        }

        <h3 className="text-lg font-semibold">{title}</h3>

        {description && 
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {description}
            </p>
        }

        {action && <div className="mt-4">{action}</div>}
        </div>
    )
}