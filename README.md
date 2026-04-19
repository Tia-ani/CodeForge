# CodeForge

A modern online coding platform inspired by LeetCode, built with React, Node.js, and SQLite. Features real-time code execution, visual debugging with Forge-Sight, and a beautiful High-Contrast Mocha & Clay theme.

## Features

### Core Functionality
- **120+ Coding Problems** - Easy, Medium, and Hard difficulty levels
- **Multi-Language Support** - Python, Java, and C++
- **Real-Time Code Execution** - Run and test code with custom inputs
- **Automated Judging** - Evaluate submissions against hidden test cases
- **Submission History** - Track your progress and past submissions
- **Leaderboard** - Compete with other users based on solved problems

### Unique Features
- **Forge-Sight Visual Execution Tracer** - Step-by-step debugging with variable inspection
- **Study Plans** - Organized learning tracks (Beginner, Data Structures, Algorithms, Interview Prep)
- **Favorites** - Save and organize problems for later practice
- **High-Contrast Theme** - Accessible design with 7:1 contrast ratio (WCAG AAA)

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Monaco Editor** for code editing
- **Vite** for fast development
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Sequelize ORM** with SQLite
- **JWT** for authentication
- **bcryptjs** for password hashing

### Architecture Patterns
- **Strategy Pattern** - Judge Engine for multi-language execution
- **Factory Pattern** - Executor creation
- **Observer Pattern** - Leaderboard updates
- **DTO Pattern** - Standardized API responses

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.x (for code execution)
- Java JDK 11+ (for Java execution)
- g++ compiler (for C++ execution)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Credentials

**User Account:**
- Email: `anishka@codeforge.com`
- Password: `user123`

**Admin Account:**
- Email: `admin@codeforge.com`
- Password: `admin123`

## Database

The project uses SQLite for easy setup. The database file is created automatically at `backend/codeforge.sqlite`.

### Reset Database

If you need to reset the database:

```bash
cd backend
npm run reset-db
npm run dev
```

This will delete the database and reseed it with fresh data.

## Key Features Explained

### Forge-Sight Visual Execution Tracer

When your code fails a test case, Forge-Sight captures the execution trace:
- **Variable Snapshots** - See variable values at each line
- **Line Highlighting** - Visual indicator of current execution line
- **Step Navigation** - Move forward/backward through execution
- **Call Stack Depth** - Understand function call hierarchy

### Study Plans

Four curated learning tracks:
1. **Beginner Fundamentals** - Arrays, Strings, Basic Math
2. **Data Structures Mastery** - Trees, Graphs, Hash Tables
3. **Algorithm Techniques** - DP, Greedy, Backtracking
4. **Interview Preparation** - Top 75 LeetCode-style problems

### Custom Test Cases

Before submitting, test your code with custom inputs:
1. Click the **Testcase** tab
2. Enter your input (one value per line)
3. Click **Run** to see the output
4. Verify correctness before submitting

## Theme

CodeForge uses a custom **High-Contrast Mocha & Clay** theme:
- **Background**: Deep Mocha (#0D0D0D)
- **Primary**: Burnt Orange (#FF5722)
- **Accent**: Clay (#3D1F16)
- **Contrast Ratio**: 7:1+ (WCAG AAA compliant)

## Project Structure

```
CodeForge/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # API controllers
│   │   ├── dtos/          # Data Transfer Objects
│   │   ├── middlewares/   # Auth middleware
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   ├── seeders/       # Database seeders
│   │   └── services/      # Business logic
│   ├── codeforge.sqlite   # SQLite database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── styles/        # CSS styles
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem details
- `GET /api/problems/tags` - Get tag counts

### Submissions
- `POST /api/submissions` - Submit code for judging
- `POST /api/submissions/run` - Run code with custom input
- `GET /api/submissions` - Get user's submission history
- `GET /api/submissions/:id/trace` - Get execution trace

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard rankings

### Profile
- `GET /api/profile` - Get user profile

## Testing

### Test a Submission

1. Navigate to any problem (e.g., Two Sum)
2. Write your solution
3. Click **Submit**
4. View results with test case details

### Test Custom Input

1. Go to **Testcase** tab
2. Enter input (e.g., `[2,7,11,15]` and `9`)
3. Click **Run**
4. See output: `[0,1]`

### Test Forge-Sight Tracer

1. Submit code with a wrong answer
2. Click **View Execution Trace** button
3. Use Previous/Next to step through execution
4. Watch variables change in the inspector


## Authors

- **Anishka Khurana** 

- Built as a university project demonstrating software design patterns
- Uses Monaco Editor (VS Code's editor)

---
