import React, { useState, useEffect } from 'react';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
const baseURL = process.env.REACT_APP_BACKEND_URL;

const Contribute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    numberOfTests: '',
    testCases: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (token && loggedInUser) {
      setIsAuthenticated(true);
      setUsername(loggedInUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title' && value.length > 70) return;
    if (name === 'description' && value.length > 1000) return;

    const nextFormData = {
      ...formData,
      [name]: value
    };
    setFormData(nextFormData);

    console.log(nextFormData);
  };

  const handleTestCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 5 && value <= 20) {
      const nextFormData = {
        ...formData,
        numberOfTests: value,
        testCases: Array.from({ length: value }, () => ({ input: '', output: '' }))
      };
      setFormData(nextFormData);
      console.log(nextFormData);
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][field] = value;
    const nextFormData = {
      ...formData,
      testCases: updatedTestCases
    };
    setFormData(nextFormData);

    console.log(nextFormData);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { title, description, difficulty, numberOfTests, testCases } = formData;

  // Basic validation
  if (!title || !description || !difficulty || !numberOfTests || !testCases.length) {
    return handleError("All fields are required.");
  }

  console.log(difficulty);
  if (!['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
    return handleError("Difficulty must be one of: Easy, Medium, or Hard.");
  }

  if (Number(numberOfTests) < 5 || Number(numberOfTests) > 20) {
    return handleError("Number of tests must be between 5 and 20.");
  }

  // Validate test cases
  for (let i = 0; i < testCases.length; i++) {
    const { input, output } = testCases[i];
    if (!input || !output) {
      return handleError(`Test case ${i + 1} is incomplete.`);
    }
  }

  try {
    const url = `${baseURL}/crud/addQues`; // adjust if needed
    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log(result);

    const { success, message } = result;

    if (success) {
      handleSuccess(message || "Question submitted successfully!");
      // Optional: Reset form
      setFormData({
        title: '',
        description: '',
        difficulty: '',
        numberOfTests: '',
        testCases: [],
      });
    } else {
      handleError(message || "Failed to submit question.");
    }
  } catch (err) {
    console.error(err);
    handleError("Something went wrong while submitting the question.");
  }
};


  if (!isAuthenticated) {
    return <div className="text-center text-white mt-10">Please login to contribute questions.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Hi {username}, specify the details of the question you wish to add:
      </h2>
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1 text-gray-200">Question Title (max 70 chars)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded"
            required
          />
          <div className="text-sm text-gray-400 mt-1">
            {formData.title.length}/70
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-200">Question Description (max 1000 chars)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded"
            rows="6"
            required
          />
          <div className="text-sm text-gray-400 mt-1">
            {formData.description.length}/1000
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-200">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded"
            required
          >
            <option value="">Select</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-200">Number of Test Cases (5-20)</label>
          <input
            type="number"
            name="numberOfTests"
            value={formData.numberOfTests}
            onChange={handleTestCountChange}
            className="w-full border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded"
            min={5}
            max={20}
            required
          />
        </div>

        {formData.testCases.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Test Cases</h3>
            {formData.testCases.map((tc, index) => (
              <div key={index} className="p-4 bg-gray-800 border border-gray-700 rounded">
                <p className="text-white font-semibold mb-2">Test Case {index + 1}</p>
                <div className="mb-2">
                  <label className="block text-sm text-gray-300">Input</label>
                  <textarea
                    className="w-full bg-gray-700 text-white rounded px-2 py-1"
                    rows="2"
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Expected Output</label>
                  <textarea
                    className="w-full bg-gray-700 text-white rounded px-2 py-1"
                    rows="2"
                    value={tc.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Question
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default Contribute;
