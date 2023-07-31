import axios from "axios";
import JWTManager from "./jwt"
import { baseURL } from "./config";

const axiosClient = axios.create({
    baseURL,
})

axiosClient.interceptors.request.use(
    config => {
      config.headers['Authorization'] = `Bearer ${JWTManager.getToken()}`;
          return config;
      },
      error => {
          return Promise.reject(error);
      }
  );

export default axiosClient