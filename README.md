# Tutor Assistant AI

> **An AI-powered teaching assistant that helps educators create classroom-ready resources in seconds.**

Tutor Assistant AI is a full-stack AI application designed to simplify lesson planning and classroom preparation. Teachers can instantly generate worksheets, quizzes, homework, lesson plans, and topic explanations, organize them in one place, and export them as printable PDFs.

## 🌐 Live Demo

**Frontend:** https://tutor-assistant-ai.vercel.app

**Backend API:** https://tutor-assistant-ai.onrender.com

---

## ✨ Key Features

- 📄 AI Worksheet Generator
- 📝 AI Quiz Generator
- 📚 AI Homework Generator
- 🎯 AI Lesson Planner
- 💡 AI Topic Explainer
- 📂 Resource Management
- 📥 PDF Export
- 🌙 Dark Mode
- 🔐 Secure Authentication
- 📊 Teacher Dashboard

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### AI
- Google Gemini API

### Authentication
- JWT
- HTTP-Only Cookies
- Bcrypt

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/tutor-assistant-ai.git
cd tutor-assistant-ai
```

### Install dependencies

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_model

CLIENT_ORIGIN=http://localhost:5173
```

### Run the project

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

## 🎯 Why Tutor Assistant AI?

Teachers spend hours preparing classroom materials.

Tutor Assistant AI reduces that work to a few seconds by using AI to generate high-quality, editable, and printable educational resources, allowing educators to focus more on teaching and less on preparation.

---

## 🚀 Future Roadmap

- AI-powered grading
- Student progress tracking
- Google Classroom integration
- Multi-language support
- Collaborative lesson planning
- Rich text editor
- Classroom management

---

## 👩‍💻 Author

**Azra**

