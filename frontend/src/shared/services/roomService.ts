import axiosClient from "../lib/axiosClient";
import { RoomType } from "../types/room";


export default {
    getRoom: (codeRoom: string) => axiosClient.get<RoomType>(`rooms/${codeRoom}`),
    createRoom: (max_player: number, words_collection_id: number, number_of_round: number, time_per_round: number, language_code: string, is_public: boolean, thumbnail: string) => axiosClient.post<RoomType>(`rooms`, { max_player, words_collection_id, number_of_round, time_per_round, language_code, is_public, thumbnail }),
    filterRooms: (theme: string, languageCode: string, search: string) => axiosClient.get<RoomList[]>(`rooms?theme=${theme}&language_code=${languageCode}&search=${search}`),
}