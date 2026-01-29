/**
 * Global API Configuration
 * This file exports the base API URL that can be used throughout the application
 * It automatically switches between local and production URLs based on the environment
 */

// Get the API URL from environment variables
// Vite exposes env variables that start with VITE_ prefix
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Export a default object for convenience
export default {
    API_URL,
    // You can add other API-related configurations here
    SOCKET_URL: API_URL, // Same URL for socket.io connection
};
