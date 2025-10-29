import type { ReactNode } from "react";
import { createContext, useState } from "react";
import type { User } from "../Pages/Profile";

type UserContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    refreshData: (user_id: number) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) as User : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        window.location.href="/login";
    };
    const refreshData = async (user_id: number) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/users?u=${user_id}`);
            const data = await res.json();
            if (data[0]?.data) {
                setUser(data[0].data);
                localStorage.removeItem("user");
                localStorage.setItem("user", JSON.stringify(data[0].data));
            }
        } catch (error) {
            console.error("Error refreshing user data:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, refreshData }}>
            {children}
        </UserContext.Provider>
    );
};