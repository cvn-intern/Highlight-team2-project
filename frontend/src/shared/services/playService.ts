import axiosClient from "../lib/axiosClient";

export default {
    quickPlay: () => axiosClient.get<any>("rooms/quick-play"),
    roomParticipants: (codeRoom: string) => axiosClient.get<any>(`rooms/participants/${codeRoom}`),
    roomInformation: (codeRoom: string) => axiosClient.get<any>(`rooms/${codeRoom}`),
}