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
  Icon: ({}) => JSX.Element;
  confirmText?: string;
  cancelText?: string;
  alertMessage?: string;
}

export default function AlertDialogYesNo({
  buttonContent,
  buttonVariant = "outline",
  buttonClassName = "",
  onYesClick = () => {},
  onNoClick = () => {},
  Icon,
  confirmText = "Continue",
  cancelText = "Cancel",
  alertMessage = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          {buttonContent}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flexCenter">
            <Icon />
          </div>
          <AlertDialogDescription className="text-center">
            {alertMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel onClick={onNoClick}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onYesClick}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
