import { Triangle } from "lucide-react";
import { useNavigate } from "react-router";

const CreateRoomsHeader = () => {
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate("/");
    };

    return (
        <div className="flex justify-between w-full">
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
            <div className="w-full text-center mr-10">
                <p className="text-5xl font-balsamiq text-sky-600">
                    SET UP
                </p>
            </div>
            
        </div>
    )
}

export default CreateRoomsHeader;