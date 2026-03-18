import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add logic if needed in the future (e.g., logging or global transformations)
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const apiCall = async (endpoint: string, method: string = "GET", body?: any) => {
    try {
        const response = await axiosInstance({
            url: endpoint,
            method,
            data: body,
        });

        return response.data;
    } catch (error: any) {
        // Axios stores the response data in error.response
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        throw new Error(errorMessage);
    }
};

export default axiosInstance;
