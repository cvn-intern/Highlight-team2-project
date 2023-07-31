
import ThemeImage from "@/shared/assets/game-avatars/deer.png";
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/shadcn-ui/select";
import ThemeCard from "./ThemeCard.component";
import SettingRoomForm from "./SettingRoomForm.component";


const arr = new Array(60).fill(0);

const CreateRoomsContent = () => {

    return (
        <div className="flex justify-center items-center w-[90%] h-[80%] bg-gray-300 rounded-2xl mt-5 p-2 gap-x-2">

            <div className="w-[60%] h-full border rounded-2xl bg-white text-center">
                <p className="text-3xl font-bakbak text-cyan-800 mt-2">1. Settings</p>
                <div className="flex flex-col border p-5 m-5 rounded-xl">
                    <SettingRoomForm />
                </div>
            </div>

            <div className="flex flex-col items-center bg-white w-full h-full rounded-2xl">
                <div className="flex w-full justify-between px-6 mt-4 gap-x-5">
                    <p className="text-3xl font-bakbak text-cyan-800 mt-2">2. Theme</p>
                    <Select>
                        <SelectTrigger className="w-[40%] rounded-xl text-md">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl text-md">                            
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="your">Your Themes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <ScrollArea className="h-full max-h-[50vh] rounded-2xl border py-5 px-2 m-4">
                    <div className="grid grid-cols-3">
                        {arr.map(() => {
                            return <ThemeCard img={ThemeImage} />
                        })}
                    </div>

                </ScrollArea>

            </div>
        </div>
    )
}

export default CreateRoomsContent;