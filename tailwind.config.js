/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    light: '#8b5cf6', // Violet-500
                    DEFAULT: '#7c3aed', // Violet-600
                    dark: '#6d28d9', // Violet-700
                },
                secondary: {
                    DEFAULT: '#ec4899', // Pink-500
                },
                dark: {
                    bg: '#0f172a', // Slate-900
                    paper: '#1e293b', // Slate-800
                }
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(124, 58, 237, 0.3)',
            }
        },
    },
    plugins: [],
}
