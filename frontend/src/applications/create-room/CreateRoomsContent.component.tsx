
import DoorIcon from "@/shared/assets/door-icon.svg";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/shadcn-ui/select";
import themeService from "@/shared/services/themeService";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingRoomForm from "./SettingRoomForm.component";
import ThemeCard from "./ThemeCard.component";
import useToaster from "@/shared/hooks/useToaster";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const DEFAULT_ROUND = "3";
const DEFAULT_PLAYER = "8";


type Theme = {
    id: number
    name: string
    thumbnail: string
}

const formSchema = z.object({
    players: z.string().nonempty(),
    visible: z.boolean(),
    round: z.string().nonempty(),
  });
  
const CreateRoomsContent = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            players: DEFAULT_PLAYER,
            round: DEFAULT_ROUND,
            visible: false,

        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSubmit = (_: z.infer<typeof formSchema>) => {
        return handleCreateRoom();
    };

    const handleCreateRoom = async () => {
        try {
            const players = parseInt(form.getValues("players"));
            const round = parseInt(form.getValues("round"));
            const visible = form.getValues("visible");

            console.log(players);
            console.log(round);
            console.log(visible);


        } catch (error: any) {
            (error);
            useToaster({
                type: "error",
                message: error.response.data.response || "Some error occurred!",
            });
        }
    };


    const [themesList, setThemesList] = useState<Array<Theme>>([]);
    const [selectedThemeId, setSelectedThemeId] = useState(0);
    const navigate = useNavigate();
    const handleExitButton = () => {
        navigate("/rooms");
    };
    const getThemesList = async () => {
        await themeService.getThemes().then(result => setThemesList(result.data));

    }
  
    useEffect(() => { getThemesList() }, []);

    return (
        <>
            <div className="flex max-lg:flex-col justify-center items-center lg:w-[90%] lg:h-[80%] lg:bg-gray-300 rounded-2xl mt-5 lg:p-6 gap-x-2">

                <div className="lg:w-[42%] w-full h-full border rounded-2xl bg-white text-center">
                    <p className="text-2xl font-balsamiq text-[#1B67AD] mt-5">1. SETTINGS</p>
                    <div className="flex flex-col border p-5 m-5 rounded-xl place-content-center h-[80%]">
                        <SettingRoomForm handleSubmit={handleSubmit} form={form}/>
                    </div>
                </div>

                <div className="flex flex-col items-center w-full lg:h-full gap-y-2 ">
                    <div className="flex w-full justify-between p-5 mt-1 gap-x-5  bg-white rounded-2xl">
                        <p className="text-2xl font-balsamiq text-[#1B67AD] mt-1">2. THEME</p>
                        <Select>
                            <SelectTrigger className="w-[40%] rounded-xl md:text-lg font-bold border-2 text-slate-500">
                                <SelectValue placeholder="Themes Filter" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl md:text-lg font-semibold text-slate-500">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="your">Your Themes</SelectItem>
                                <SelectItem value="offical">Offical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ScrollArea className="xl:h-full md:h-[70%] h-[50%] w-full max-h-[50vh] rounded-2xl border py-5 px-2 bg-white overflow-x-scoll">
                        <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2">
                            {themesList.map((theme) => {
                                return <ThemeCard
                                    name={theme.name.toUpperCase()}
                                    img={theme.thumbnail}
                                    onClick={() => setSelectedThemeId(theme.id)}
                                    isSelected={theme.id === selectedThemeId}
                                />
                            })}
                        </div>
                    </ScrollArea>

                </div>

            </div>
            <div className="flex max-lg:flex-col lg:gap-3 lg:my-5 max-md:mt-[-15vh]">
                <Button
                    type="submit"
                    variant="opacityHover"
                    className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-[#C13A3A] py-5 w-[200px]"
                    onClick={handleExitButton}
                >
                    <LogOut strokeWidth={3} size={32} />
                    <p className="text-lg">EXIT</p>
                </Button>
                <Button
                    type="submit"
                    variant="opacityHover"
                    className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-[#22A699] py-5 w-[200px]"                    
                >
                    <img src={DoorIcon} alt="" className="w-[18%]" />
                    <p>NEW ROOMS</p>
                </Button>

            </div>
        </>

    )
}

export default CreateRoomsContent;