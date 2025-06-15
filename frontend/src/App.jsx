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
import Profile from './pages/profile'

function Home() {
  const sections = [
    {
      title: "Start Coding to Solve Problems",
      description:
        "Practice coding and algorithm skills on programming challenges. Sharpen your problem-solving abilities and compete with a global community.",
      image:
        "https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/download.png",
      buttonText: "Solve Problems",
      buttonLink: "/problemset",
    },
    {
      title: "Get your solution re-viewed by Jiraiya Sensei",
      description: `Sharpen your coding skills under the watchful eyes of the Toad Sage himself.
Let Jiraiya Sensei — symbolic of wisdom, experience, and tough-love mentorship — guide you toward writing cleaner, smarter, and more efficient code.
Whether you’re a beginner refining your logic or a seasoned coder looking for deeper insights, this is your dojo for leveling up through honest, constructive feedback and ninja-grade reviews.`,
      image:
        "https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/jiraiya-removebg-preview.png",
    },
    {
      title: "Contribute problems to the community",
      description:
        `Help shape the coding journey of thousands by contributing your own custom challenges to the platform.
Whether it’s a brain-twisting algorithm, a real-world application, or a fun puzzle — your problems can inspire learners, test experts, and build a culture of creative thinking.
Sharpen your problem-design skills, gain recognition in the community, and become part of something bigger than just solving — start creating.`,
      image:
        "https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/kakashi_chibi-removebg-preview.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 space-y-10">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`bg-gray-800 rounded-2xl shadow-lg max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start p-10 md:p-16 gap-10 ${
            index === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-6">{section.title}</h1>
            <p className="text-gray-300 text-lg mb-8 whitespace-pre-line">
              {section.description}
            </p>
            {section.buttonText && section.buttonLink && (
              <a
                href={section.buttonLink}
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                {section.buttonText}
              </a>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={section.image}
              alt={`${section.title} Illustration`}
              className="max-w-[300px] md:max-w-[350px] h-auto"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
            <Navbar />
      <Sidebar />
      {/* <Navbar /> */}
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
