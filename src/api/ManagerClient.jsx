import axios from "axios";
import { toast } from "react-toastify";
import { BASE_API_URL } from "./constant";
import { encryptData } from "../utils/Encrypt";
import { decryptData } from "../utils/Decrypt";

const baseURL = BASE_API_URL;

const api = axios.create({
  baseURL,
});

// Skip ngrok browser warning when backend is behind ngrok
api.interceptors.request.use((config) => {
  if (baseURL && baseURL.includes("ngrok")) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }
  return config;
});

function redirectToAdminLogin() {
  if (typeof window === "undefined") return;
  // Avoid redirect loops if we're already on /admin
  if (!window.location.pathname.startsWith("/admin")) return;
  window.location.href = "/admin";
}

const handleRequest = async (method, url, data = null, customHeaders = {}) => {
  const token = localStorage.getItem("managerToken");
  const requestData = data ? encryptData(data) : null;

  try {
    const response = await api({
      method,
      url,
      data: requestData,
      headers: {
        ...customHeaders,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    const decryptedData = decryptData(response?.data?.data);
    return decryptedData;
  } catch (error) {
    const errorData =
      error?.response?.data?.data
        ? decryptData(error?.response?.data?.data)
        : {
            success: false,
            message:
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Something went wrong",
          };

    if (
      errorData?.message === "Login Error" ||
      errorData?.message === "manager Not Persent in DataBase" ||
      errorData?.message === "Invalid managerId" ||
      errorData?.message === "Token Not persent In headers"
    ) {
      localStorage.removeItem("managerToken");
      redirectToAdminLogin();
      return errorData;
    }

    if (!errorData?.success && errorData?.message) {
      toast.error(
        typeof errorData.message === "string"
          ? errorData.message
          : "Something went wrong in manager API calling"
      );
    }

    return errorData;
  }
};

export const fetchManagerData = (url) => handleRequest("get", url);
export const postManagerData = (url, data) => handleRequest("post", url, data);
export const updateManagerData = (url, data) => handleRequest("put", url, data);
export const deleteManagerData = (url, data) =>
  handleRequest("delete", url, data);

