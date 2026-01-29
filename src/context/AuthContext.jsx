import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fetch current user on mount if token exists
    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error fetching user:', error);
            // Token might be invalid, clear it
            logout();
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            console.log('Attempting signup with:', { ...userData, password: '***' });
            const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
            console.log('Signup response:', response.data);
            const { token: newToken, user: newUser } = response.data;

            setToken(newToken);
            setUser(newUser);
            setIsAuthenticated(true);
            localStorage.setItem('token', newToken);

            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Signup error:', error);
            console.error('Error response:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Signup failed'
            };
        }
    };

    const login = async (credentials) => {
        try {
            console.log('Attempting login with:', { ...credentials, password: '***' });
            const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
            console.log('Login response:', response.data);
            const { token: newToken, user: newUser } = response.data;

            setToken(newToken);
            setUser(newUser);
            setIsAuthenticated(true);
            localStorage.setItem('token', newToken);

            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await axios.put(`${API_URL}/api/auth/profile`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const changePassword = async (passwords) => {
        try {
            const response = await axios.put(`${API_URL}/api/auth/password`, passwords, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password change failed'
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        updateProfile,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
