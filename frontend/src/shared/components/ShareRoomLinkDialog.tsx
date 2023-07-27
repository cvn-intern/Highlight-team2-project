import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/shadcn-ui/dialog";
import TooltipIcon from "./TooltipIcon";
import { Copy, Share2 } from "lucide-react";
import ShareIcon from "@/shared/assets/icons/share-icon.svg"
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./shadcn-ui/Button";
import QRCode from "react-qr-code";
import useToaster from "../hooks/useToaster";

type ShareMode = "link" | "qr-code"

const ShareRoomLinkDialog = () => {
    const roomLink = window.location.href

    const [shareMode, setShareMode] = useState<ShareMode>("link")

    const handleSelectShareMode = (mode: ShareMode) => setShareMode(mode)

    const handleCopyRoomLink = () => {
        navigator.clipboard.writeText(roomLink)
        useToaster({
            type: "success",
            message: "Copied",
            position: "bottom-right"
        })
    }

    return (
        <Dialog>
            <DialogTrigger>
                <TooltipIcon
                    icon={Share2}
                    text="Share"
                    iconSize={33}
                />
            </DialogTrigger>
            <DialogContent className="max-w-[350px] sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="mb-8 text-4xl text-center text-transparent uppercase bg-gradient-to-r from-[#242e35] bg-clip-text">
                        Share
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex p-1 w-[80%] rounded-xl border-[1px] border-black/30 font-bold text-lg mx-auto mb-6">
                            <div className={cn("bg-transparent py-1 text-center px-4 flex-1 rounded-xl cursor-pointer", {
                                "bg-[#677d8b] text-white ": shareMode === "link"
                            })} onClick={() => handleSelectShareMode("link")}>
                                LINK
                            </div>
                            <div className={cn("bg-transparent py-1 text-center px-4 flex-1 rounded-xl cursor-pointer", {
                                "bg-[#677d8b] text-white": shareMode === "qr-code"
                            })} onClick={() => handleSelectShareMode("qr-code")}>
                                QR CODE
                            </div>
                        </div>

                    </DialogDescription>
                </DialogHeader>
                {shareMode === "link" ? (
                    <>
                        <div className="p-3 bg-gradient-to-r from-[#BBD2C5] to-[#536976] w-fit mx-auto rounded-full border-4 border-black shadow-md">
                            <img
                                alt=""
                                src={ShareIcon}
                                className="object-cover w-32 h-w-32 scale-110"
                            />
                        </div>

                        <p className="text-center mt-4 text-lg font-semibold">Invite your friends to the room!</p>
                        <div className="py-1 px-3 md:px-10 w-fit mx-auto border-2 border-slate-400 rounded-xl text-lg font-semibold text-slate-500">
                            {roomLink}
                        </div>


                        <Button
                            variant="opacityHover"
                            className="gap-4 mb-4 md:mt-4 mt-7 rounded-full border-8 border-black font-black bg-gradient-to-r from-[#4c5f70] to-[#bdc3c7] p-5 w-[200px] mx-auto justify-start "
                            onClick={handleCopyRoomLink}
                        >
                            <Copy fill="#fff" />
                            <p className="text-xl ml-4">COPY</p>
                        </Button>
                    </>
                ) : (
                    <>
                        <QRCode
                            size={256}
                            className="w-[40%] mx-auto h-auto"
                            value={roomLink}
                        />
                        <p className="text-center mt-2.5 mb-5 text-xl font-semibold text-slate-600">You know exactly what this is!</p>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ShareRoomLinkDialog