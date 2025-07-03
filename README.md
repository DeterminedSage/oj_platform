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

### 4. Setting up environment variables for running on local machine

In the frontend direcotry , create a .env file and add the following :-  

```.env
VITE_BACKEND_URL=http://localhost:8080
```

In the backend direcotry , create a .env file and add the following parameters :-  

```.env
PORT=8080
MONGODB_URL=
JWT_SECRET="any-secret"
GOOGLE_API_KEY = 
```

Google api key can be genrated via Google studios (refer : https://ai.google.dev/)
Ensure to add a proper Mongodb-URL for proper operations



