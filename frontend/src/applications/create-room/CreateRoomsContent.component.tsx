
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import ThemeImage from "@/shared/assets/game-avatars/deer.png"
import ThemeCard from "./ThemeCard.component";

const arr = new Array(60).fill(0);;
const CreateRoomsContent = () => {
   
    return (
        <div className="flex justify-center items-center w-[90%] h-[80%] bg-gray-300 rounded-2xl mt-5 p-2 gap-x-2">
            <div className="bg-white w-[60%] h-full rounded-2xl">

            </div>
            <div className="bg-white w-full h-full rounded-2xl">
                <ScrollArea className="h-full max-h-[50vh] rounded-2xl border py-5 px-2">
                    <div className="grid grid-cols-3">
                        {arr.map(() => {
                            return <ThemeCard img={ThemeImage}/>
                        })}                    
                    </div>

                </ScrollArea>

            </div>
        </div>
    )
}

export default CreateRoomsContent;