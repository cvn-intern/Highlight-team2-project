import axiosClient from "../lib/axiosClient";

export default {
    getRoom: (codeRoom: string) => axiosClient.get<RoomInfo>(`rooms/${codeRoom}`),
}