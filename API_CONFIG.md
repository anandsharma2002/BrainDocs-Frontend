# BrainDocs Frontend - API Configuration Guide

## Overview
This application uses environment variables to manage API endpoints for both local development and production deployment.

## Environment Files

### `.env` (Local Development)
```env
VITE_API_URL=http://localhost:5000
```
This file is used when running the app locally with `npm run dev`.

### `.env.production` (Production Build)
```env
VITE_API_URL=https://braindocs-backend-rxtx.onrender.com
```
This file is automatically used when building for production with `npm run build`.

## How It Works

1. **Global API Configuration**: The `src/config/api.js` file exports a global `API_URL` variable that can be imported anywhere in the application.

2. **Environment-Based URL**: The API URL automatically switches based on the environment:
   - **Development** (`npm run dev`): Uses `http://localhost:5000`
   - **Production** (`npm run build`): Uses `https://braindocs-backend-rxtx.onrender.com`

3. **Usage in Components**: Import and use the API_URL in any component:
   ```javascript
   import { API_URL } from '../config/api';
   
   // Use in API calls
   axios.get(`${API_URL}/api/topics`);
   ```

## Running the Application

### Local Development
```bash
npm run dev
```
The app will connect to `http://localhost:5000` (make sure your backend is running locally on port 5000).

### Production Build
```bash
npm run build
```
The built app will connect to `https://braindocs-backend-rxtx.onrender.com`.

## Changing the API URL

### For Local Development
Edit `.env` and change the `VITE_API_URL` value:
```env
VITE_API_URL=http://localhost:3001  # or any other port
```

### For Production
Edit `.env.production` and change the `VITE_API_URL` value:
```env
VITE_API_URL=https://your-new-backend-url.com
```

## Important Notes

- **Restart Required**: After changing environment variables, you must restart the development server for changes to take effect.
- **VITE_ Prefix**: All environment variables must start with `VITE_` to be accessible in the application.
- **Git Ignore**: The `.env` file should be added to `.gitignore` to prevent committing sensitive information.
- **Socket.io**: The Socket.io connection also uses the same `API_URL` for consistency.

## Troubleshooting

### API calls are failing
1. Check if the backend server is running
2. Verify the `VITE_API_URL` in your `.env` file
3. Restart the development server after changing environment variables
4. Check browser console for CORS errors

### Environment variables not updating
1. Stop the development server (`Ctrl+C`)
2. Clear the Vite cache: `rm -rf node_modules/.vite`
3. Restart the development server: `npm run dev`
