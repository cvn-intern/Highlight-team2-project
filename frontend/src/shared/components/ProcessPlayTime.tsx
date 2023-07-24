import React from "react"
import { Progress } from "./shadcn-ui/progress"

export function ProgressPlayTime() {
    const [progress, setProgress] = React.useState(100)

    const MIN_PROGRESS_PERCENTAGE = 0
    const MAX_PROGRESS_PERCENTAGE = 100
    const PROGRESS_STEP = 0.006
    const PROGRESS_MILI_PER_SECOND = 10

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) =>
                prevProgress <= MIN_PROGRESS_PERCENTAGE ? MAX_PROGRESS_PERCENTAGE : prevProgress - PROGRESS_STEP
            )
        }, PROGRESS_MILI_PER_SECOND)
        return () => {
            clearInterval(timer)
        }
    }, [])

    return <Progress value={progress} color="red" className="absolute bottom-1 w-[98%] h-3 left-1/2 -translate-x-1/2 bg-slate-200" />
}