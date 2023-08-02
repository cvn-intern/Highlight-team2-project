import { Globe, Swords, User2 as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/shadcn-ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";

interface RoomFilterInformationProps {
  roomFilter: Array<RoomList>;
}

interface SelectCodeRoomProps {
  selectCodeRoom: string;
  setSelectCodeRoom: (codeRoom: string) => void;
}

const ListOfRoom: React.FC<
  RoomFilterInformationProps & SelectCodeRoomProps
> = ({ roomFilter, selectCodeRoom, setSelectCodeRoom }) => {
  const handleSelectRoom = (codeRoom: string) => {
    if (selectCodeRoom === codeRoom) {
      setSelectCodeRoom("");
    } else {
      setSelectCodeRoom(codeRoom);
    }
  };

  return (
    <div className="bg-[#00416A]/40 p-2 rounded-2xl w-full xl:w-[93.1%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  items-start justify-start gap-2 flex-1 pb-2 h-[540px] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full">
        {roomFilter.map((roomFilter, index) => (
          <button
            key={index}
            onClick={() => handleSelectRoom(roomFilter.code_room)}
          >
            <Card
              key={index}
              className={`rounded-[10px] max-h-[255px] w-full aspect-square cursor-pointer hover:opacity-80 hover:bg-white border-4 border-transparent ${
                selectCodeRoom === roomFilter.code_room ? "border-blue-500" : ""
              }`}
            >
              <CardContent className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center space-x-1 rounded-md p-4">
                  <Avatar className="relative flex items-center bg-yellow-300 w-[80px] h-auto overflow-visible border-4 border-solid">
                    <AvatarImage
                      src={roomFilter.thumbnail}
                      alt="thumbnail"
                      className="border-2 border-white border-solid rounded-full"
                    />
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="flex flex-col justify-center items-center text-xl font-medium bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                    <strong>{roomFilter.theme_name.toUpperCase()}</strong>
                    <span className="text-sm bg-gradient-to-r from-[#bdbaa3] to-[#b20a2c] bg-clip-text text-transparent">
                      #{roomFilter.code_room}
                    </span>
                  </p>
                  <div className="flex flex-row items-center space-x-8 mt-6">
                    <div className="flex flex-col justify-between items-center">
                      <UserIcon
                        size={32}
                        strokeWidth={2.5}
                        className="text-blue-500"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                          <strong>
                            {roomFilter.number_of_participants}/
                            {roomFilter.max_player}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-center">
                      <Globe
                        size={32}
                        strokeWidth={2.5}
                        className="text-blue-500"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                          <strong>{roomFilter.language.toUpperCase()}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-center">
                      <Swords
                        size={32}
                        strokeWidth={2.5}
                        className="text-blue-500"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                          <strong>
                            {roomFilter.current_round}/
                            {roomFilter.number_of_round}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListOfRoom;
