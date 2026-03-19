import { BASE_URL } from "@/constants";
import axios from "axios";

export const login = async (email: string, password: string): Promise<{ token: string }> => {
    try {
        const url = `${BASE_URL}/auth/login`;
        console.log("Login API path:", url);
        const response = await axios.post(url, { email, password });
        return response.data;
    } catch (error: any) {
        console.log("Login failed", error);
        const res = error.response?.data?.message || "Login failed";
        throw res;
    }
}

export const register = async (name: string, email: string, password: string, avatar: string | null): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, { name, email, password, avatar });
        return response.data;
    } catch (error: any) {
        console.log("Register failed", error);
        const res = error.response?.data?.message || "Register failed";
        throw res;
    }
}
