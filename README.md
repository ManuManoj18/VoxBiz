# VoxBiz 🔊📊

> 🚀 AI-powered voice-to-visualization platform for real-time business insights  
> 🏆 Built during HackToFuture 3.0 | Top 5 Finalist in Industry & Trade Track

VoxBiz enables non-technical decision-makers to interact with their business databases using natural language — either through voice or text — and instantly see real-time data visualizations. From PostgreSQL queries to intelligent graph suggestions, VoxBiz transforms complex data retrieval into a seamless and intuitive experience.

---

## 🌟 Key Features

- 🎙️ **Voice-to-SQL Engine** — Converts natural language (voice or text) into executable SQL queries using Google Gemini AI and schema understanding
- 📊 **Smart Visualization** — Automatically selects the most suitable graph/chart (bar, line, pie, area, scatter) based on query results and data structure
- 🧠 **AI-powered Insights** — Leverages Google Gemini to generate business insights, explanations, and strategic roadmaps
- 🧾 **Email Reports** — Automatically sends query results and visualizations to users via email
- 🔐 **Secure DB Access** — PostgreSQL database connections with user authentication and session management
- 📈 **Query History** — Logs queries, voice/text prompts, and execution metadata for audit and review
- 🌐 **Multi-language Support** — Voice recognition supporting multiple languages including English, Hindi, Kannada, Tamil, Telugu
- 🎨 **Interactive UI** — Modern, responsive interface with dark/light themes and animated components

---

## 💻 Tech Stack

### Frontend:
- **React.js** with Vite for fast development
- **Framer Motion** for animations and smooth transitions
- **Recharts** for data visualizations (bar, line, pie, area, scatter charts)
- **Tailwind CSS** for modern UI styling
- **Three.js** for 3D animations and immersive components
- **Material-UI** for enhanced UI components
- **Web Speech API** for voice-to-text functionality

### Backend:
- **Node.js + Express.js** server framework
- **Sequelize ORM** for database operations
- **PostgreSQL** for data storage and user database connections
- **Google Generative AI (Gemini)** for natural language processing and SQL generation
- **JWT** for authentication and session management
- **Multer** for file uploads (Excel/CSV processing)

### Integrations:
- 📩 **Nodemailer** for email functionality
- 🎤 **Web Speech API** for voice input
- 🤖 **Google Gemini AI** for NLP and business insights
- 🔐 **Google OAuth** for authentication
- 📊 **React Speech Kit** for text-to-speech features

---

## 📁 Project Structure

```
VoxBiz/
├── client/                          # React frontend
│   ├── public/
│   │   └── oauth-callback.html      # OAuth callback handler
│   └── src/
│       ├── components/              # Reusable UI components
│       │   ├── Chat.jsx            # Business intelligence chat assistant
│       │   ├── GraphRender.jsx     # Data visualization renderer
│       │   ├── Navbar.jsx          # Navigation component
│       │   ├── VoiceSearchModal.jsx # Voice input modal
│       │   ├── EmailDataModal.jsx   # Email data export modal
│       │   ├── CreateDatabaseModal.jsx # Database creation modal
│       │   └── ui/                 # UI utility components
│       ├── pages/                  # Main application pages
│       │   ├── HomePage.jsx        # Landing page
│       │   ├── Hero.jsx           # Hero section with demos
│       │   ├── DBSelection.jsx    # Database selection page
│       │   ├── DBDetail.jsx       # Database details page
│       │   ├── Table.jsx          # Data table view
│       │   └── VisChoice.jsx      # Visualization choice page
│       ├── context/               # React context providers
│       ├── lib/                   # Utility libraries and API configs
│       └── styles/               # Global styles
├── server/                        # Node.js backend
│   ├── controllers/               # Business logic controllers
│   │   ├── Auth.controller.js     # Authentication logic
│   │   ├── Query.controller.js    # Query processing and NLP
│   │   ├── Database.controller.js # Database management
│   │   ├── DatabaseDescription.controller.js # Schema analysis
│   │   └── GoogleAuth.controller.js # Google OAuth
│   ├── models/                   # Sequelize database models
│   │   ├── User.model.js         # User model
│   │   ├── Database.model.js     # Database connection model
│   │   └── QueryLog.model.js     # Query history model
│   ├── routes/                   # API route definitions
│   ├── middleware/               # Authentication and request middleware
│   ├── config/                   # Database and app configuration
│   ├── services/                 # External service integrations
│   │   └── FastAPIClient.js      # External API client service
│   └── jwt/                     # JWT token utilities
└── README.md
```

---

## 🚀 Quick Setup Guide

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** database
- **Google Gemini API Key**
- **Google OAuth credentials** (optional)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/VoxBiz.git
cd VoxBiz
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voxbiz_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_API_GOOGLE=your_google_translate_api_key
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Database Setup

1. Create a PostgreSQL database named `voxbiz_db`
2. The application will automatically create the required tables on first run
3. You can connect your own PostgreSQL databases through the application interface

---

## 🎯 How It Works

### 1. **Voice Input Processing**
- Users speak their query in natural language
- Web Speech API converts speech to text
- Support for multiple languages (English, Hindi, Kannada, Tamil, Telugu)

### 2. **Natural Language to SQL Conversion**
- Google Gemini AI processes the natural language query
- Database schema is analyzed to understand table relationships
- AI generates optimized SQL queries based on user intent

### 3. **Query Execution & Data Retrieval**
- Generated SQL is executed against the user's PostgreSQL database
- Results are processed and formatted for visualization
- Query history is logged for audit purposes

### 4. **Smart Visualization Selection**
- System analyzes data structure (categorical vs numerical fields)
- Automatically suggests appropriate chart types:
  - **Bar Charts**: For categorical comparisons
  - **Line Charts**: For time series data
  - **Pie Charts**: For proportional data
  - **Scatter Plots**: For correlation analysis
  - **Area Charts**: For cumulative data trends

### 5. **AI-Powered Insights**
- Gemini generates business insights based on visualization data
- Provides explanations of chart patterns and trends
- Creates strategic roadmaps and actionable recommendations

### 6. **Data Export & Sharing**
- Email reports with visualizations and insights
- CSV data export functionality
- Scheduled email reports for regular updates

---

## 🎮 Usage Examples

### Voice Queries
- *"Show me sales data for the last quarter"*
- *"ಕನ್ನಡದಲ್ಲಿ ಗ್ರಾಹಕರ ಮಾಹಿತಿ ತೋರಿಸಿ"* (Show customer information in Kannada)
- *"Generate a report of top performing products"*
- *"Compare revenue across different regions"*

### Text Queries
- "SELECT * FROM orders WHERE date >= '2024-01-01'"
- "Analyze customer satisfaction by product category"
- "Show inventory levels below minimum threshold"

---

## 🔧 Configuration

### Database Connections
- Navigate to Database Selection page
- Add your PostgreSQL connection details
- Test connection and save for future use


### Visualization Preferences
- Customizable chart colors and themes
- Dark/Light mode support
- Responsive design for all screen sizes

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🏆 Achievements

- **Top 5 Finalist** at HackToFuture 3.0 in Industry & Trade Track
- **Innovation Award** for AI-powered voice-to-visualization technology
- **Best User Experience** for intuitive multi-language support

---


*Built with ❤️ by the VoxBiz Team*