MindMate 🌿

A full-stack mental wellness web app built with Django and React. MindMate helps users track their mood, analyse stress levels, get AI-powered support, and find mental health professionals.
🚀 Features

🌿 Mood Journal — Log daily emotions with emoji selection and personal notes

🧘 Stress Check — Analyse stress from text input with a visual meter and breathing exercise

✦ AI Companion — Chat-style interface with smart contextual wellness responses

🤝 Find Therapists — Browse and add mental health professionals to a directory

🔐 Authentication — Secure user registration and login with JWT tokens

🛠️ Tech Stack

LayerTechnologyFrontendReact, AxiosBackendDjango, Django REST FrameworkAuthJWT (SimpleJWT)DatabaseSQLiteStylingCustom CSS, DM Sans, DM Serif Display

📁 Project Structure
MindMate/
├── backend/
│   ├── backend/        # Django settings, urls
│   ├── api/            # Models, views, serializers
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── public/
    └── src/
        ├── components/ # MoodLogs, StressAnalysis, AIAdvice, Therapists, AuthPage
        ├── App.js
        └── api.js
⚙️ Setup & Installation
Backend
bashcd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend
bashcd frontend
npm install
npm start
```

Visit **http://localhost:3000** to use the app.

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:
```

📸 Pages

Landing page — Welcome screen with feature overview

Login / Register — Clean split-screen auth forms

Dashboard — Sidebar navigation with 4 main pages

🙌 Acknowledgements

Built as a personal project to explore full-stack development with Django and React.



Built with care for mental wellness 🌿
