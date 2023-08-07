import { Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { useTranslation } from "react-i18next";

const CreateRoomsHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate("/rooms");
    };
    useDisableBackButton();
    return (
        <div className="flex justify-between lg:w-full w-[70%]">
            <div>
                <button
                    onClick={handleBackButton}
                >
                    <Triangle
                        size={40}
                        strokeWidth={2.5}
                        className="-rotate-90 fill-[#f7b733] hover:opacity-80"
                    />
                </button>
            </div>
            <div className="w-full max-lg:mt-2 text-center lg:mr-10">
                <p className="lg:text-5xl text-2xl font-coiny bg-gradient-to-r from-[#2196f3] to-[#FFC371] text-transparent bg-clip-text pt-3">
                    {t("CreateRoom.setUpLabel")}
                </p>
            </div>            
        </div>
    )
}

export default CreateRoomsHeader;