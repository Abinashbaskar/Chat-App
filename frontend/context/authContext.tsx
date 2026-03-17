import { login, register } from "@/services/authServices";
import { connectSocket, disconnectSocket } from "@/socket/socket";
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
    initialized: false,
})


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadToken();
    }, []);
    const loadToken = async () => {
        const StoreToken = await AsyncStorage.getItem("token");
        console.log(StoreToken, "ghdgh")
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

                // Connect socket in background without blocking navigation
                connectSocket().catch(err => console.log("Socket background connection error:", err.message));

                gotoHomePage();
            }
            catch (error) {
                console.log("Token loading error:", error);
                await AsyncStorage.removeItem("token");
                setToken(null);
                setUser(null);
                gotoWelcomePage();
            } finally {
                setInitialized(true);
            }
        } else {
            gotoWelcomePage();
            setInitialized(true);
        }
    }

    const gotoHomePage = () => {
        // wait is only for showing splash screen
        setTimeout(() => {
            router.replace("/Main/home");
        }, 0);
    }

    const gotoWelcomePage = () => {
        // wait is only for showing splash screen
        setTimeout(() => {
            router.replace("/Auth/Welcome");
        }, 0);
    }

    const updateToken = async (token: string) => {
        console.log('--- updateToken Started ---');
        if (!token) {
            console.log('No token provided to updateToken');
            return;
        }

        setToken(token);
        await AsyncStorage.setItem("token", token);

        const decodedToken = jwtDecode<DecodedTokenProps>(token);

        setUser(decodedToken.user);
    };

    const signIn = async (email: string, password: string) => {
        const response = await login(email, password);
        await updateToken(response.token);

        // Connect socket in background
        connectSocket().catch(err => console.log("Socket connection error after sign-in:", err.message));

        router.replace("/Main/home");
    };
    const signUp = async (name: string, email: string, password: string, avatar: string | null) => {
        const response = await register(name, email, password, avatar);
        await updateToken(response.token);

        // Connect socket in background
        connectSocket().catch(err => console.log("Socket connection error after sign-up:", err.message));

        router.replace("/Main/home");
    };
    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        disconnectSocket();
        router.replace("/Auth/Welcome");
    };
    return (
        <AuthContext.Provider value={{ token, user, signIn, signUp, signOut, updateToken, initialized }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
}