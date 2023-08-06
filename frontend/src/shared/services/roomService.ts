import axiosClient from "../lib/axiosClient";
import { RoomType } from "../types/room";

export default {
  getRoom: (codeRoom: string) => axiosClient.get<RoomType>(`rooms/${codeRoom}`),
  createRoom: ({
    max_player,
    words_collection_id,
    number_of_round,
    time_per_round,
    is_public,
  }: RoomCreateDTO) =>
    axiosClient.post<RoomCreate>(`rooms`, {
      max_player,
      words_collection_id,
      number_of_round,
      time_per_round,
      is_public,
    }),
  getRoomsByQuery: ({ theme, languageCode, search }: GetRoomsByQueryDTO) =>
    axiosClient.get<RoomList[]>(
      `rooms?theme=${theme}&language_code=${languageCode}&search=${search}`
    ),
};
