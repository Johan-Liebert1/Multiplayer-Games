import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? (process.env.REACT_APP_DEV_BACKEND_URL as string)
    : (process.env.REACT_APP_PROD_BACKEND_URL as string);

export const axiosInstance = axios.create({
  baseURL: baseURL + "/api",
  headers: {
    "Content-Type": "application/json"
  }
});
