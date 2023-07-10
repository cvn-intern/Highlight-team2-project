import axiosClient from "../axiosClient";

export default {
    login: (data: LoginInputType) => axiosClient.post<LoginPayload>("", data),
}