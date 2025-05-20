import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { handleError, handleSuccess } from '../utils'; // assuming same utils
import 'react-toastify/dist/ReactToastify.css';

const Report = () => {
  const token = localStorage.getItem('token');

  const [searchType, setSearchType] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [question, setQuestion] = useState(null);

  if (!token) return null;

  // const result = null;

  const handleSearch = async (e) => {

    e.preventDefault();

    const url = `http://localhost:8080/enquiry/getQues?${searchType}=${encodeURIComponent(searchValue)}`
    console.log(url);
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(token);

      const result = await response.json();

      if (!result.success) {
        handleError(result.message || "Question not found.");
        setQuestion(null);
      } else {
        setQuestion(result.question); 
        handleSuccess("Question founderation");
      }
    } catch (err) {
      console.error(err);
      handleError("Error fetching question.");
    }
  };

  const handleDelete = async () => {
    const url = `http://localhost:8080/report/deleteQues/${question.qid}`; // or `id` depending on response
    console.log(question.qid);
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        handleSuccess("Question deleted.");
        setQuestion(null);
        setSearchValue('');
      } else {
        handleError(result.message || "Delete failed.");
      }
    } catch (err) {
      console.error(err);
      handleError("Error deleting question.");
    }
  };

  const handleUpdate = async () => {
    const url = `http://localhost:8080/report/updateQues/${question.qid}`; // adjust path

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(question),
      });

      const result = await response.json();
      if (result.success) {
        handleSuccess("Question updated.");
      } else {
        handleError(result.message || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      handleError("Error updating question.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-4">Search & Manage Questions</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block mb-1">Search Ques Via</label>
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchValue('');
              setQuestion(null);
            }}
            className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
          >
            <option value="id">Ques ID</option>
            <option value="qtitle">Ques Title</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Enter {searchType === 'id' ? 'Question ID' : 'Question Title'}</label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          Search
        </button>
      </form>

      {question && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Edit Question</h3>

          <div>
            <label className="block mb-1">Title</label>
            <input
              name="title"
              value={question.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={question.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={question.difficulty}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button onClick={handleUpdate} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white">
              Update
            </button>
            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white">
              Delete
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Report;


