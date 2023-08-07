import { Globe, Swords, User2 as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/shadcn-ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";
import Room404 from "./room404.component";

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
  console.log("roomFilter", roomFilter);
  if (roomFilter.length === 0) {
    return <Room404 />;
  }
  const handleSelectRoom = (codeRoom: string) => {
    if (selectCodeRoom === codeRoom) {
      setSelectCodeRoom("");
    } else {
      setSelectCodeRoom(codeRoom);
    }
  };

  return (
    <div className="border bg-[#00416A]/40 p-2 rounded-2xl w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  items-start justify-start gap-3 flex-1 m-4 pb-2 h-[540px]">
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
              <CardContent className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center p-4 space-x-1 rounded-md">
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
                  <p className="flex flex-col items-center justify-center text-xl font-medium text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text">
                    <strong>{roomFilter.theme_name.toUpperCase()}</strong>
                    <span className="text-sm bg-gradient-to-r from-[#bdbaa3] to-[#b20a2c] bg-clip-text text-transparent">
                      #{roomFilter.code_room}
                    </span>
                  </p>
                  <div className="flex flex-row items-center mt-6 space-x-8">
                    <div className="flex flex-col items-center justify-between">
                      <UserIcon
                        size={32}
                        strokeWidth={2.5}
                        className="text-blue-500"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-medium text-center text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text">
                          <strong>
                            {roomFilter.number_of_participants}/
                            {roomFilter.max_player}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-between">
                      <Globe
                        size={32}
                        strokeWidth={2.5}
                        className="text-blue-500"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-medium text-center text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text">
                          <strong>{roomFilter.language.toUpperCase()}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-between">
                      <Swords
                        size={32}
                        strokeWidth={2.5}
                        className="text-blue-500"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-medium text-center text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text">
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
