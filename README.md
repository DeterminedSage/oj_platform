# OJ Platform

OJ Platform is a full-stack web application designed as an Online Judge (OJ) system for coding challenges. The platform allows users to submit code solutions for programming problems and automatically evaluates them, providing immediate feedback on correctness. It leverages the MERN stack to create a responsive and scalable experience: a **React** frontend for the user interface, a **Node.js/Express** backend for handling submissions and evaluations, and **MongoDB** for data storage.

## 🚀 Tech Stack

- **MongoDB** – NoSQL database for storing problems, submissions, and user data  
- **Express.js** – Web framework for building backend APIs  
- **React.js** – Frontend library for building user interfaces  
- **Node.js** – Backend runtime environment  

## 🔧 Installation

To run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/DeterminedSage/oj_platform.git
cd oj_platform
```

### 2. Install and Run Frontend

```bash
cd frontend && npm install && npm run dev
```

### 3. Install and Run Backend

In a new terminal , 

```bash
cd backend && npm install && npm start
```

Note: Ensure MongoDB is running locally or update the backend config to use a remote MongoDB URI.

