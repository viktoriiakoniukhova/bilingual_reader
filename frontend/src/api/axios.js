import axios from "axios";

const baseURL = import.meta.env.DJANGO_BACKEND_URL || "http://localhost:8000";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.set("Authorization", `Token ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
