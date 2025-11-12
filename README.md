# CampusConnect-AI 🎓

AI-powered system that automatically summarizes campus announcements and displays them on a live website.

## 📋 Overview

CampusConnect-AI is an intelligent platform that helps students and faculty stay informed about campus activities. It uses AI to automatically summarize lengthy announcements and categorizes them for easy browsing.

## 🏗️ Project Structure

```
CampusConnect-AI/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variables template
│   ├── Procfile           # Deployment configuration
│   ├── utils/             # Utility modules
│   │   ├── summarizer.py       # AI text summarization
│   │   ├── classifier.py       # Notice categorization
│   │   └── supabase_client.py  # Database client
│   └── tests/             # Test suite
│       └── test_webhook.py
│
├── frontend/              # Next.js frontend
│   ├── pages/            # Next.js pages
│   │   ├── index.js      # Home page
│   │   └── _app.js       # App wrapper
│   ├── components/       # React components
│   │   ├── NoticeCard.js     # Notice display card
│   │   ├── Navbar.js         # Navigation bar
│   │   └── Loader.js         # Loading spinner
│   ├── styles/           # CSS modules
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   ├── next.config.js    # Next.js configuration
│   └── .env.local.example # Frontend environment template
│
├── docs/                 # Documentation
├── .gitignore           # Git ignore rules
├── LICENSE              # MIT License
└── README.md            # This file
```

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Run the backend server:
   ```bash
   python main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

- `GET /` - Health check
- `GET /api/notices` - Retrieve notices
- `POST /api/notices` - Create a new notice
- `POST /api/webhook` - Webhook for external integrations

## 🔧 Configuration

### Backend Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase API key
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `ANTHROPIC_API_KEY` - (Optional) Anthropic API key
- `PORT` - Server port (default: 8000)

### Frontend Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🎯 Features

- ✅ AI-powered text summarization
- ✅ Automatic notice categorization
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Category filtering
- ✅ RESTful API
- ✅ Webhook support

## 📦 Technologies

**Backend:**
- FastAPI
- Python 3.8+
- OpenAI/Anthropic AI
- Supabase

**Frontend:**
- Next.js 14
- React 18
- CSS Modules

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in this repository.
