import { Button } from "@/common/components/ui/Button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/common/components/ui/Modal"
import { Input } from "@/common/components/ui/Input"
import { Label } from "@/common/components/ui/label"

export function DialogDemo() {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Username
                    </Label>
                    <Input id="username" value="@peduarte" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" className="flex items-center justify-center">Save changes</Button>

            </DialogFooter>
        </DialogContent>
    )
}