# VolunteerMe

## Development

1. **Install dependencies**
   - Backend: `npm install` (in project root)
   - Frontend: `npm install` (in `volunteer system frontend/`)

2. **Start backend**
   - In project root: `npm start` (or `node server.js`)

3. **Start frontend (for development)**
   - In `volunteer system frontend/`: `npm run dev`
   - The frontend will proxy API requests to the backend automatically.

## Production

1. **Build frontend**
   - In `volunteer system frontend/`: `npm run build`

2. **Serve with backend**
   - The backend (`server.js`) is configured to serve the built frontend from `volunteer system frontend/dist`.
   - Start the backend: `npm start` (or `node server.js`)
   - Visit your site at `http://localhost:5000` (or your configured port).

## Notes
- All API calls from the frontend use relative `/api` URLs for compatibility.
- The backend serves static files and handles all routing for client-side navigation. 