import clsx from "clsx"
import { cn } from "../lib/utils"

interface SpinnerProps {
    className?: string
}

export const Spinner = ({ className }: SpinnerProps) => {
    return (
        <div className={clsx("w-full h-full flex items-center justify-center", className)}>
            <div
                className={clsx(
                    "w-8 h-8 border-4 rounded-full",
                    "border-t-transparent border-green-500",
                    "animate-spin"
                )}
                style={{ animationDuration: "0.8s" }}
                aria-label="Loading"
            />
        </div>
    )
}

export function BarsSpinner({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-end gap-1 h-8 bg-transparent', className)}>
            {[0, 1, 2, 3].map(i => (
                <span
                    key={i}
                    className="w-1.5 bg-current rounded-full h-full origin-bottom animate-[equalizer_1s_ease-in-out_infinite]"
                    style={{ animationDelay: `-${i * 0.15}s` }}
                />
            ))}
        </div>
    )
}

export function DotsSpinner({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
        </div>
    )
}