import axiosClient from "../lib/axiosClient";

export default {
  updateUser: (data: any) => axiosClient.put<any>("users/update-profile", data),
  getAvatars: () => axiosClient.get<Array<string>>("users/avatars"),
  updateLanguage: (language_code: string) =>
    axiosClient.patch<any>(
      `users/update-language?language_code=${language_code}`
    ),
};
