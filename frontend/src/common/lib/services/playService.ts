import axiosClient from "../axiosClient";

export default {
    quickPlay: () => axiosClient.get<any>("room/quick-play"),
}