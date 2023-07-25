import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo"
import TooltipIcon from "@/shared/components/TooltipIcon"
import ExitImg from "@/shared/assets/exit.png"
import { AlertCircle, LogOut, Volume2, VolumeX, X } from "lucide-react"
import SettingIcon from "@/shared/assets/icons/setting-icon.png"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/shadcn-ui/dialog"

const ActionButtons = () => {

    const [isSound, setIsSound] = useState(true)

    const toggleSound = () => setIsSound(prev => !prev)

    return (
        <div className="w-full absolute top-[-45px]"
        >
            <div className="w-full flex items-center justify-between text-white">
                <TooltipIcon icon={isSound ? Volume2 : VolumeX} text="Sound" onClick={toggleSound} />
                <div className="flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <TooltipIcon icon={AlertCircle} text="Info" iconSize={28} />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle className="text-center text-4xl uppercase mb-8 bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">Room Infomation</DialogTitle>
                                <DialogDescription>
                                    <div className="p-3 bg-gradient-to-r from-[#BBD2C5] to-[#536976] w-fit mx-auto rounded-full border-4 border-black shadow-md">
                                        <img alt="" src={SettingIcon} className="w-32 h-32 object-cover" />
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 grid-cols-3">
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-[#334d50] font-semibold text-lg">Theme:</p>
                                    <p className="bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent font-bold text-xl">General</p>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-[#334d50] font-semibold text-lg">Rounds:</p>
                                    <p className="bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent font-bold text-xl">12 rounds</p>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-[#334d50] font-semibold text-lg">Language:</p>
                                    <p className="bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent font-bold text-xl">English</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <AlertDialogYesNo
                        buttonContent={<TooltipIcon icon={X} text="Exit" />}
                        buttonVariant={"link"}
                        buttonClassName="text-white"
                        Icon={LogOut}
                        iconSize={50}
                        confirmText="Yes"
                        cancelText="No"
                        headerChildren={<img src={ExitImg} alt="" className="w-32 h-32 object-cover mb-2" />}
                        alertMessage="Do you want to leave the game?"
                        messageClassName="text-xl font-bold text-black"
                        cancelClassName="rounded-full border-8 border-black font-black bg-gradient-to-r from-[#00416A] to-[#E4E5E6] p-5 w-[150px] text-xl text-black hover:text-white"
                        confirmClassName="rounded-full border-8 border-black font-black bg-gradient-to-r from-[#ffd452] to-[#E4E5E6] p-5 w-[150px] text-xl text-black hover:text-white"
                        containerClassName="h-[400px] flex flex-col items-center justify-center gap-10  border-8 border-[#00416A]/90"
                    />
                </div>
            </div>


        </div>
    )

}

export default ActionButtons