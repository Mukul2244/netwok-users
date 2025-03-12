import axios from "axios";
import getCookie from "@/lib/getCookie";

const axiosInstance = axios.create({
  // baseURL: "https://rk4huq4sfe.execute-api.eu-north-1.amazonaws.com",
  baseURL: "https://netwok.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach the token dynamically
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getCookie("accessToken"); // Get token from server cookies

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post('/customers/regenerate-token/')
        await axios.post('/api/setCookie', {
          accessToken: response.data.new_token
        })
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.new_token}`;
        originalRequest.headers["Authorization"] = `Bearer ${response.data.new_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {  
        console.error("Error refreshing token:", refreshError);
        axios.post('/api/logout')
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;

