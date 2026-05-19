# AI-Based Smart Complaint Management System

A full-stack MERN application with AI-powered complaint analysis, JWT authentication, and real-time status tracking.

## Features
- 📝 Complaint Registration (name, email, title, description, category, location, status)
- 📋 View, filter by category & search by location
- 🔄 Update complaint status (Pending / Resolved / Rejected)
- 🤖 AI Analysis: priority detection, department suggestion, auto-response, summary
- 🔐 JWT Authentication + bcrypt password hashing

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Vanilla CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **AI**: OpenRouter API (Gemini 2.5 Flash)

## Setup

### Backend
```bash
cd backend
npm install
# fill in .env (see .env.example)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### `backend/.env`
```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your secret key>
AI_API_KEY=<your OpenRouter API key>
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/complaints` | Add complaint |
| GET | `/api/complaints` | Get all complaints |
| PUT | `/api/complaints/:id` | Update status |
| GET | `/api/complaints/search?location=X` | Search by location |
| POST | `/api/ai/analyze` | AI analysis |
