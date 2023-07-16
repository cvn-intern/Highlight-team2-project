import axiosClient from "../axiosClient";

export default {
    quickPlay: () => axiosClient.get<any>("rooms/quick-play"),
    roomParticipants: (codeRoom: string) => axiosClient.get<any>(`rooms/participants/${codeRoom}`),
}