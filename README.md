# Mini Social Post Application

A full-stack MERN app for creating accounts, posting text/images, and liking/commenting on posts — inspired by the TaskPlanet Social page.

## Tech Stack
- Frontend: React.js (plain CSS only)
- Backend: Node.js + Express
- Database: MongoDB (images stored directly in the database as base64 strings)
- Auth: JWT + bcrypt

## Project Structure
```
social-app/
  backend/     -> Express API server
  frontend/    -> React client
```

## Local Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGO_URI (MongoDB Atlas connection string) and JWT_SECRET
npm run dev
```
Backend runs on http://localhost:5000

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# .env already points to http://localhost:5000/api by default
npm start
```
Frontend runs on http://localhost:3000

## MongoDB Collections
- `users`: name, email, password (hashed)
- `posts`: user, username, text, image (base64 string), likes (array of usernames), comments (array of {username, text, createdAt})

## API Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Log in |
| GET | /api/posts?page=&limit= | No | Paginated public feed |
| POST | /api/posts | Yes | Create post (text and/or image) |
| POST | /api/posts/:id/like | Yes | Toggle like |
| POST | /api/posts/:id/comment | Yes | Add comment |

## Deployment

### MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow network access from anywhere (0.0.0.0/0) for simplicity.
3. Copy the connection string into `MONGO_URI`.

### Backend on Render
1. Push this repo to GitHub.
2. On Render, create a new Web Service, point it at the `backend` folder.
3. Build command: `npm install`  |  Start command: `npm start`
4. Add environment variables `MONGO_URI` and `JWT_SECRET` in Render's dashboard.

### Frontend on Vercel
1. Import the repo into Vercel, set the root directory to `frontend`.
2. Add environment variable `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
3. Deploy.

## Notes
- Images are stored as base64 data URLs directly in MongoDB (no external storage / file system needed), per requirements. Keep uploaded images reasonably small (~under 2-3MB) since MongoDB documents have a 16MB limit.
- Both text and image fields are optional individually, but at least one is required to create a post.
- Likes and comments store usernames and update the UI instantly after each action.
