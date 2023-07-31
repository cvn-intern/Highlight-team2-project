import axiosClient from "../lib/axiosClient";
interface Theme{
    id: string
    name: string
    thumbnail: string
}
export default {
    getThemes: () => axiosClient.get<Array<Theme>>("themes"),
}