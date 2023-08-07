import axiosClient from "../lib/axiosClient";
import { Theme } from "../types/theme";

export default {
  getThemes: () => axiosClient.get<Theme[]>("themes"),
};
