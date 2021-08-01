import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_BACKEND_URL
    : process.env.REACT_APP_PROD_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});
