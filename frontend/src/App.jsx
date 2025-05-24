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
import List from './pages/list'
import QuestionDetails from './pages/QuestionDetails'

function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Online Judge</h1>
      <p>This is the home page with intro content and a couple of images.</p>
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
          <Route path="/list" element={<List />} />
          <Route path="/question/:qid" element={<QuestionDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
