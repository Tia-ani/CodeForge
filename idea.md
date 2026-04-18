# CodeForge – Online Code Judge Platform

## Project Overview

CodeForge is a Full Stack Online Code Judge platform where users can solve programming problems and receive automated evaluation based on predefined test cases.

The system allows users to:
- View coding problems
- Submit solutions in supported languages
- Receive verdicts (Accepted, Wrong Answer, TLE, Compilation Error)
- Track submission history
- View leaderboard rankings

The backend is the core focus of this project and follows proper software engineering and system design practices.

---

## Key Features

1. User Authentication (JWT-based)
2. Role-based access (User, Admin)
3. Problem Management (Admin can create/edit/delete problems)
4. Code Submission System
5. Automated Code Execution Engine
6. Test Case Evaluation
7. Submission Verdict System
8. Leaderboard System
9. Submission History Tracking

---

## Backend Architecture

The backend follows a layered architecture:

- Controller Layer
- Service Layer
- Repository Layer
- DTO Pattern
- Global Exception Handling

---

## OOP Principles Used

- Encapsulation
- Abstraction
- Inheritance
- Polymorphism

---

## Design Patterns

- Strategy Pattern → Different language execution strategies
- Factory Pattern → Executor creation
- Singleton Pattern → Judge engine instance
- Observer Pattern → Leaderboard update on submission

---

## Tech Stack

Backend: (Spring Boot / Node.js / Django – to be finalized)  
Database: MySQL / PostgreSQL  
Authentication: JWT  
Frontend: React  
Containerization: Docker
