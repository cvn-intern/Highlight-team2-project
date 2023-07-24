import React from "react"
import { Progress } from "./shadcn-ui/progress"
 
export function ProgressPlayTime() {
  const [progress, setProgress] = React.useState(100)
 
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress <= 0 ? 100 : prevProgress - 0.006
      )
    }, 10)
    return () => {
      clearInterval(timer)
    }
  }, [])
 
  return <Progress value={progress} color="red" className="absolute bottom-1 w-[98%] h-3 left-1/2 -translate-x-1/2 bg-slate-200" />
}