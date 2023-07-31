import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/shadcn-ui/avatar-shadcn';
import { RoomType } from '@/shared/types/room';
import { Globe, Swords, User2 as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
} from '@/shared/components/shadcn-ui/card';



const test = [
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  {
    theme: "animal",
    codeRoom: "USAKJQ_1",
    numberPlayer: 9,
    maxPlayer: 11,
    maxRound: 5,
    language: "EN",
  },
  
];


const ListOfRoom = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<RoomType>();
  // useEffect(() => {
  //   const getRoomInformation = async () => {
  //     if (!codeRoom) return;
  //     try {
  //       const { data } = await roomService.getRoom(codeRoom);
  //       setRoomData(data);
  //     } catch (error) {
  //       useToaster({
  //         type: 'error',
  //         message: 'Room not found!',
  //       });
  //       navigate('/');
  //     }
  //   };

  //   getRoomInformation();
  // }, []);

  // if (!roomData) return null;

  return (
    <div className='bg-[#00416A]/40 pt-2 rounded-2xl'>

    <div className="flex flex-wrap gap-2 w-full flex-1  h-full p-2 pt-0 pr-1 max-h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full scroll-mr-96">
      {test.map((test, _index) => (
        <Card className="w-fit rounded-[10px] flex-1 aspect-square cursor-pointer hover:opacity-80 hover:bg-white">
          <CardContent className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center space-x-1 rounded-md p-4">
              <Avatar className="relative flex items-center bg-yellow-300 w-[80px] h-auto overflow-visible border-4 border-solid">
                <AvatarImage
                  src={roomData ? roomData.thumbnail : 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-9/108183626_2708185066093656_2321218826465342306_n.jpg?_nc_cat=100&cb=99be929b-59f725be&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=fCYrtIa7w0cAX_vMTiU&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfCfXiQwX5KCgSQ7EKmkqCI9mufGLKOt5Ys2X8Ohp6sB5Q&oe=64EEEB34'}
                  alt="thumbnail"
                  className="border-2 border-white border-solid rounded-full"
                />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-xl font-medium bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                <strong>
                  {test.theme.toUpperCase()} # {test.codeRoom}
                </strong>
              </p>
              <div className="flex flex-row items-center space-x-8 mt-6">
                <div className='flex flex-col justify-between items-center'>
                  <UserIcon size={32} strokeWidth={2.5} className="text-blue-500" />
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                      <strong>
                        {test.numberPlayer}/
                        {test.maxPlayer}
                      </strong>
                    </p>
                  </div>
                </div>
                <div className='flex flex-col justify-between items-center'>
                  <Globe size={32} strokeWidth={2.5} className="text-blue-500" />
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                      <strong>
                        {test.language}
                      </strong>
                    </p>
                  </div>
                </div>
                <div className='flex flex-col justify-between items-center'>
                  <Swords size={32} strokeWidth={2.5} className="text-blue-500" />
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                      <strong>
                        1/{test.maxRound}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    </div>
  );
};

export default ListOfRoom;

