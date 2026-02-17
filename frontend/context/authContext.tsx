import { login, register } from "@/services/authServices";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState, } from "react";

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    updateToken: async () => { },
})


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadToken();
    }, []);
    const loadToken = async () => {
        const StoreToken = await AsyncStorage.getItem("token");
        if (StoreToken) {
            try {
                const decodedToken = jwtDecode<DecodedTokenProps>(StoreToken);
                if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
                    await AsyncStorage.removeItem('token');
                    gotoWelcomePage();
                    return;
                }
                setToken(StoreToken);
                setUser(decodedToken.user);
                gotoHomePage();
            }
            catch (error) {
                console.log(error);
                await AsyncStorage.removeItem("token");
                setToken(null);
                setUser(null);
                gotoWelcomePage();
            }
        } else {
            gotoWelcomePage();
        }
    }

    const gotoHomePage = () => {
        // wait is only for showing splash screen
        setTimeout(() => {
            router.replace("/Main/home");
        }, 1500);
    }

    const gotoWelcomePage = () => {
        // wait is only for showing splash screen
        setTimeout(() => {
            router.replace("/Auth/Welcome");
        }, 1500);
    }

    const updateToken = async (token: string) => {
        if (!token) return;

        setToken(token);
        await AsyncStorage.setItem("token", token);

        const decodedToken = jwtDecode<DecodedTokenProps>(token);
        console.log(decodedToken, "decoded token");

        setUser(decodedToken.user);
    };

    const signIn = async (email: string, password: string) => {
        const response = await login(email, password);
        await updateToken(response.token);
        router.replace("/Main/home");
    };
    const signUp = async (name: string, email: string, password: string, avatar: string | null) => {
        const response = await register(name, email, password, avatar);
        await updateToken(response.token);
        router.replace("/Main/home");
    };
    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        router.replace("/Auth/Welcome");
    };
    return (
        <AuthContext.Provider value={{ token, user, signIn, signUp, signOut, updateToken }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
}