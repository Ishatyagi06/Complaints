🛠️ AI-Based Smart Complaint Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to register and track complaints with AI-powered analysis for priority detection, department recommendation, and automated responses.

🚀 Features
👤 User Features
Register complaints
View all complaints
Filter by category
Search by location
Track complaint status
🤖 AI Features
Complaint priority detection
Department recommendation (Water, Electricity, Sanitation, etc.)
Auto-generated response
Complaint summarization
🔐 Security
JWT Authentication
bcrypt password hashing
Protected routes
🧱 Tech Stack

Frontend:

React.js
Axios
CSS / Tailwind (optional)

Backend:

Node.js
Express.js

Database:

MongoDB (Mongoose)

Deployment:

Render
📁 Project Structure
project-root/
│
├── frontend/        # React App
│   ├── src/
│   └── public/
│
├── backend/         # Node + Express API
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone <your-repo-link>
cd project-folder
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run backend:

npm start
3️⃣ Frontend Setup
cd frontend
npm install
npm start
🔌 API Endpoints
📌 Complaint APIs
POST /api/complaints → Add complaint
GET /api/complaints → Get all complaints
PUT /api/complaints/:id → Update complaint status
GET /api/complaints/search?location= → Search by location
🤖 AI API
POST /api/ai/analyze → Analyze complaint
🗄️ Database Schema (Complaint)
{
  name: String,
  email: String,
  title: String,
  description: String,
  category: String,
  location: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
}
🧪 Testing

Use Postman / Thunder Client to test APIs:

Add complaint
Fetch complaints
Update status
Search by location
AI analysis
🌐 Deployment
Backend deployed on Render
MongoDB Atlas used for database

Example:

https://your-app.onrender.com/api/complaints
📸 Screenshots (Add in submission)
Complaint Form
Complaint List
API Testing
MongoDB Data
Render Deployment
📌 Future Enhancements
Admin dashboard
Email notifications
File/image upload in complaints
Real-time updates
