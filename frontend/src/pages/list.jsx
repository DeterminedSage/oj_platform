import React, { useEffect, useState } from 'react';
import axios from 'axios';

function List() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:8080/enquiry/getAllQues');
        setQuestions(res.data);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };

    fetchQuestions();
  }, []);

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    (page - 1) * questionsPerPage,
    page * questionsPerPage
  );

  return (
    <div className="p-6 pl-12">
      <h1 className="text-2xl font-bold mb-4">Questions List</h1>
      <table className="min-w-full table-auto border border-gray-800 bg-gray-900 text-gray-100">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2 border border-gray-800 text-gray-100">QID</th>
            <th className="px-4 py-2 border border-gray-800 text-gray-100">Title</th>
            <th className="px-4 py-2 border border-gray-800 text-gray-100">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.map((q, idx) => (
            <tr
              key={q.qid}
              className={idx % 2 === 0 ? "bg-gray-900 text-gray-100 text-center" : "bg-gray-700 text-gray-100 text-center"}
            >
              <td className="px-4 py-2 border border-gray-800">{q.qid}</td>
              <td className="px-4 py-2 border border-gray-800">{q.title}</td>
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
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
    </div>
  );
}

export default List;
