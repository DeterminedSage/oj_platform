import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const baseURL = process.env.REACT_APP_BACKEND_URL;

function Problemset() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${baseURL}/crud/getAllQues`);
        setQuestions(res.data);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      q.title.toLowerCase().includes(term) ||
      q.qid.toString().toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const currentQuestions = filteredQuestions.slice(
    (page - 1) * questionsPerPage,
    page * questionsPerPage
  );

  return (
    <div className="p-6 pl-12">
      <h1 className="text-2xl font-bold mb-4">Questions List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by QID or Title..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Reset to page 1 on search
        }}
        className="mb-4 px-4 py-2 w-96 border border-gray-500 rounded bg-gray-800 text-white placeholder-gray-400"
      />

      {/* Questions Table */}
      <table className="min-w-full table-auto border border-gray-800 bg-gray-900 text-gray-100">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2 border border-gray-800 text-gray-100">QID</th>
            <th className="px-4 py-2 border border-gray-800 text-gray-100">Title</th>
            <th className="px-4 py-2 border border-gray-800 text-gray-100">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.length > 0 ? (
            currentQuestions.map((q, idx) => (
              <tr
                key={q.qid}
                className={idx % 2 === 0 ? "bg-gray-900 text-gray-100 text-center" : "bg-gray-700 text-gray-100 text-center"}
              >
                <td className="px-4 py-2 border border-gray-800">{q.qid}</td>
                <td className="px-4 py-2 border border-gray-800">
                  <Link
                    to={`/question/${q.qid}`}
                    className="text-blue-400 hover:underline hover:text-blue-300"
                  >
                    {q.title}
                  </Link>
                </td>
                <td className={`px-4 py-2 border border-gray-800 capitalize ${
                  q.difficulty === 'easy'
                    ? 'text-green-400'
                    : q.difficulty === 'medium'
                    ? 'text-yellow-400'
                    : q.difficulty === 'hard'
                    ? 'text-red-400'
                    : ''
                }`}>
                  {q.difficulty}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-400">
                No questions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredQuestions.length > 0 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Problemset;

