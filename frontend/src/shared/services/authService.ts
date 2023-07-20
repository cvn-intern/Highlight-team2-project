import axiosClient from "../lib/axiosClient";

export default {
    login: (data: LoginInputType) => axiosClient.post<LoginPayload>("", data),
    newUser: () => axiosClient.get<any>("auth/register-guest"),
    loginWithGoogle: (token: string) => axiosClient.post("auth/google/login", {token}),
    logout: () => axiosClient.post("auth/logout"),
}