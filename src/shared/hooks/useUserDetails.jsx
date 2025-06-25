import { useState, useEffect } from "react";
import { logout as logoutHandler } from "./useLogout";

const getUserDetails = () => {
    try {
        const userDetails = localStorage.getItem('user');
        return userDetails ? JSON.parse(userDetails) : null;
    } catch (error) {
        return null;
    }
};

export const useUserDetails = () => {
    const [userDetails, setUserDetails] = useState(getUserDetails);

    useEffect(() => {
        const handleStorageChange = () => {
            setUserDetails(getUserDetails());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const logout = () => {
        logoutHandler();
        setUserDetails(null);
        localStorage.removeItem('user');
    };

    return {
        isLogged: Boolean(userDetails),
        nombreUsuario: userDetails?.nombreUsuario || "Invitado",
        user: userDetails,
        logout
    };
};