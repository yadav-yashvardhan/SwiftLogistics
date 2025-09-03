import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, token) => {
        // This function now saves the entire user object,
        // including all driver details like address, phone, etc.
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (token) {
            localStorage.setItem('token', token);
        }
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};