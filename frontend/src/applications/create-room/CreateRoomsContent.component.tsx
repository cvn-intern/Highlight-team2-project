
import DoorIcon from "@/shared/assets/door-icon.svg";
import ThemeImage from "@/shared/assets/game-avatars/deer.png";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/shadcn-ui/select";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingRoomForm from "./SettingRoomForm.component";
import ThemeCard from "./ThemeCard.component";
import { useEffect, useState } from "react";
import _ from "lodash";
import themeService from "@/shared/services/themeService";


type Theme = {
    id: number
    name: string
    thumbnail: string
}

const CreateRoomsContent = () => {
    const [themesList, setThemesList] = useState<Array<Theme>>([]);
    const [themeId, setThemeId] = useState(0);
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate("/");
    };
    const getThemesList = async () => {
        await themeService.getThemes().then(result => setThemesList(result.data));

    }
    useEffect(() => { getThemesList(); console.log(themesList) }, []);

    return (
        <>
            <div className="flex justify-center items-center w-[90%] h-[80%] bg-gray-300 rounded-2xl mt-5 p-6 gap-x-2">

                <div className="w-[42%] h-full border rounded-2xl bg-white text-center">
                    <p className="text-2xl font-balsamiq text-[#1B67AD] mt-5">1. SETTINGS</p>
                    <div className="flex flex-col border p-5 m-5 rounded-xl place-content-center h-[80%]">
                        <SettingRoomForm />
                    </div>
                </div>

                <div className="flex flex-col items-center w-full h-full gap-y-2">
                    <div className="flex w-full justify-between p-5 mt-1 gap-x-5  bg-white rounded-2xl">
                        <p className="text-2xl font-balsamiq text-[#1B67AD] mt-1">2. THEME</p>
                        <Select>
                            <SelectTrigger className="w-[40%] rounded-xl text-lg font-bold border-2 text-slate-500">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl text-lg font-semibold text-slate-500">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="your">Your Themes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ScrollArea className="h-full w-full max-h-[50vh] rounded-2xl border py-5 px-2 bg-white">
                        <div className="grid grid-cols-4">
                            {themesList.map((theme) => {
                                return <ThemeCard
                                    name={theme.name}
                                    img={theme.thumbnail}
                                    onClick={() => setThemeId(theme.id)}
                                    isSelected={theme.id === themeId}
                                />
                            })}
                        </div>

                    </ScrollArea>

                </div>

            </div>
            <div className="flex gap-3 my-5">
                <Button
                    type="submit"
                    variant="opacityHover"
                    className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-[#C13A3A] py-5 w-[200px]"
                    onClick={handleBackButton}
                >
                    <LogOut strokeWidth={3} size={32} />
                    <p className="text-lg">EXIT</p>
                </Button>
                <Button
                    type="submit"
                    variant="opacityHover"
                    className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-[#22A699] py-5 w-[200px]"

                >
                    <img src={DoorIcon} alt="" className="w-[18%]" />
                    <p>NEW ROOMS</p>
                </Button>

            </div>
        </>

    )
}

export default CreateRoomsContent;