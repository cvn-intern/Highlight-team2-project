import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/shared/components/shadcn-ui/alert-dialog";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  buttonContent: React.ReactNode;
  buttonVariant?:
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;
  buttonClassName?: string;
  onYesClick?: (...args: any[]) => void;
  onNoClick?: (...args: any[]) => void;
  Icon: LucideIcon;
  iconSize?: number;
  confirmText?: string;
  cancelText?: string;
  alertMessage?: string;
  messageClassName?: string
  containerClassName?: string
  cancelClassName?: string
  confirmClassName?: string
  footerClassName?: string
  headerChildren?: React.ReactElement
}

export default function AlertDialogYesNo({
  buttonContent,
  buttonVariant = "outline",
  buttonClassName = "",
  onYesClick = () => { },
  onNoClick = () => { },
  Icon,
  iconSize = 25,
  messageClassName = "",
  confirmText = "Continue",
  cancelText = "Cancel",
  alertMessage = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  containerClassName = "",
  cancelClassName = "",
  confirmClassName = "",
  footerClassName = "",
  headerChildren
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          {buttonContent}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent style={{borderRadius: '10px'}} className={containerClassName}>
        <AlertDialogHeader>
          <div className="flexCenter">
            {headerChildren ?? <Icon size={iconSize} />} 
          </div>
          <AlertDialogDescription className={cn("text-center", messageClassName)}>
            {alertMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={cn("sm:justify-center", footerClassName)}>
          <AlertDialogCancel onClick={onNoClick} className={cancelClassName}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onYesClick} className={confirmClassName}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
