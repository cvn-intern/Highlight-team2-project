import { cn } from "@/shared/lib/utils";
import { Search } from "lucide-react";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputWithSearchIcon = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
        <div className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}>
            <Search width={24} height={24} />
            <input className="focus:outline-none"
              type={type}
              
              ref={ref}
              {...props}
            />
        </div>
    );
  }
);
InputWithSearchIcon.displayName = "InputWithSearchIcon";

export { InputWithSearchIcon };
