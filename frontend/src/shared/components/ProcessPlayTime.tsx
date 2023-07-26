import React from "react"
import { Progress } from "./shadcn-ui/progress"

export function ProgressPlayTime({step = 0.0006}) {
    const [progress, setProgress] = React.useState(100)

    const MIN_PROGRESS_PERCENTAGE = 0
    const MAX_PROGRESS_PERCENTAGE = 100
    const PROGRESS_STEP = step
    const PROGRESS_MILI_PER_SECOND = 1

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

    return <Progress value={progress} className="absolute bottom-1 w-[98%] h-2.5 left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-black" />
}