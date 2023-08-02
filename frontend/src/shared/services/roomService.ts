import axiosClient from "../lib/axiosClient";
import { RoomType } from "../types/room";


export default {
    getRoom: (codeRoom: string) => axiosClient.get<RoomType>(`rooms/${codeRoom}`),
    createRoom: (max_player: number, words_collection_id: number, number_of_round: number, time_per_round: number, is_public: boolean) => axiosClient.post<RoomCreate>(`rooms`, { max_player, words_collection_id, number_of_round, time_per_round, is_public }),
    filterRooms: (theme: string, languageCode: string, search: string) => axiosClient.get<RoomList[]>(`rooms?theme=${theme}&language_code=${languageCode}&search=${search}`),
}