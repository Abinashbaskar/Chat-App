import { Platform } from "react-native";

export const BASE_URL = Platform.OS === "android" ? "http://192.168.179.206:3000/api" : "http://localhost:3000/api";
export const SOCKET_URL = Platform.OS === "android" ? "http://192.168.179.206:3000" : "http://localhost:3000";