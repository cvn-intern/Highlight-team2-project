import axiosClient from "../lib/axiosClient";

export default {
    login: (data: LoginInputType) => axiosClient.post<LoginPayload>("", data),
    newUser: () => axiosClient.get<any>("auth/register-guest"),
    updateUser: (data: any) => axiosClient.put<any>("user/update-profile", data),
}