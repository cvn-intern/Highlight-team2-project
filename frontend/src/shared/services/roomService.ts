import axiosClient from "../lib/axiosClient";
import { RoomType } from "../types/room";

export default {
    getRoom: (codeRoom: string) => axiosClient.get<RoomType>(`rooms/${codeRoom}`),
}