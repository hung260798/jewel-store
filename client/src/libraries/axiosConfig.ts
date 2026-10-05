import axios from "axios";
import { API_URL } from "../constants/URLS";

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
