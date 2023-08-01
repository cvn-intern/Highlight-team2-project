import axiosClient from "../lib/axiosClient";
import { RoomType } from "../types/room";

export default {
    getRoom: (codeRoom: string) => axiosClient.get<RoomType>(`rooms/${codeRoom}`),
    filterRooms: (theme: string, languageCode: string, search: string) => axiosClient.get<RoomType[]>(`rooms?theme=${theme}&language_code=${languageCode}&search=${search}`),
}