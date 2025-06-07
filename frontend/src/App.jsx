import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Contribute from './pages/contribute'
import Report from './pages/remove'
import Login from './pages/login'
import Register from './pages/register'
import Problemset from './pages/problemset'
import Sidebar from './components/Sidebar'
import QuestionDetails from './pages/QuestionDetails'
import Profile from './pages/Profile'

function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="bg-gray-800 rounded-2xl shadow-lg max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start p-10 md:p-16 gap-10">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-6">Start Coding to Solve Problems</h1>
          <p className="text-gray-300 text-lg mb-8">
            Practice coding and algorithm skills on programming challenges. Sharpen your
            problem-solving abilities and compete with a global community.
          </p>
          <a
            href="/problemset"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Solve Problems
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/download.png"
            alt="Coding Illustration"
            className="max-w-full h-auto scale-110"
          />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/report" element={<Report />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problemset" element={<Problemset />} />
          <Route path="/question/:qid" element={<QuestionDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
