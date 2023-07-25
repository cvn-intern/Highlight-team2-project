import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo"
import TooltipIcon from "@/shared/components/TooltipIcon"
import ExitImg from "@/shared/assets/exit.png"
import { AlertCircle, CopyX, LogOut, Volume2, VolumeX, X } from "lucide-react"
import { useState } from "react"

const ActionButtons = () => {

    const [isSound, setIsSound] = useState(true)

    const toggleSound = () => setIsSound(prev => !prev)

    return (
        <div className="w-full absolute top-[-45px]"
        >
            <div className="w-full flex items-center justify-between text-white">
                <TooltipIcon icon={isSound ? Volume2 : VolumeX} text="Sound" onClick={toggleSound} />
                <div className="flex items-center gap-3">
                    <TooltipIcon icon={AlertCircle} text="Info" iconSize={28} />
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
                        cancelClassName="rounded-full border-8 border-black font-black bg-blue-500 p-5 w-[150px] text-xl text-black hover:text-white"
                        confirmClassName="rounded-full border-8 border-black font-black bg-[#FFE569] p-5 w-[150px] text-xl text-black hover:text-white"
                        containerClassName="h-[400px] flex flex-col items-center justify-center gap-10  border-8 border-blue-500"
                    />
                </div>
            </div>


        </div>
    )

}

export default ActionButtons