// import React, { useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import { handleError, handleSuccess } from '../utils';
// import 'react-toastify/dist/ReactToastify.css';

// const ViewQuestion = () => {
//   const token = localStorage.getItem('token');

//   const [searchType, setSearchType] = useState('id');
//   const [searchValue, setSearchValue] = useState('');
//   const [question, setQuestion] = useState(null);

//   if (!token) return null;

//   const handleSearch = async (e) => {
//     e.preventDefault();

//     const url = `http://localhost:8080/enquiry/getQues?${searchType}=${encodeURIComponent(searchValue)}`;
//     try {
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (!result.success) {
//         handleError(result.message || 'Question not found.');
//         setQuestion(null);
//       } else {
//         setQuestion(result.question);
//         handleSuccess('Question fetched successfully.');
//       }
//     } catch (err) {
//       console.error(err);
//       handleError('Error fetching question.');
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-gray-900 text-white">
//       <h2 className="text-xl font-semibold mb-4">View Question Details</h2>

//       <form onSubmit={handleSearch} className="space-y-4">
//         <div>
//           <label className="block mb-1">Search Question By</label>
//           <select
//             value={searchType}
//             onChange={(e) => {
//               setSearchType(e.target.value);
//               setSearchValue('');
//               setQuestion(null);
//             }}
//             className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
//           >
//             <option value="id">Ques ID</option>
//             <option value="qtitle">Ques Title</option>
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1">
//             Enter {searchType === 'id' ? 'Question ID' : 'Question Title'}
//           </label>
//           <input
//             type="text"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
//             required
//           />
//         </div>

//         <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
//           Search
//         </button>
//       </form>

//       {question && (
//         <div className="mt-8 space-y-4">
//           <h3 className="text-lg font-semibold">Question Details</h3>

//           <div>
//             <p className="font-medium">Title:</p>
//             <p className="bg-gray-800 border border-gray-700 px-3 py-2 rounded">{question.title}</p>
//           </div>

//           <div>
//             <p className="font-medium">Description:</p>
//             <p className="bg-gray-800 border border-gray-700 px-3 py-2 rounded whitespace-pre-line">
//               {question.description}
//             </p>
//           </div>

//           <div>
//             <p className="font-medium">Difficulty:</p>
//             <p className="bg-gray-800 border border-gray-700 px-3 py-2 rounded capitalize">{question.difficulty}</p>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default ViewQuestion;

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';

const ViewQuestion = () => {
  const token = localStorage.getItem('token');

  const [searchType, setSearchType] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [question, setQuestion] = useState(null);

  const [code, setCode] = useState(`#include <iostream>\n\nint main() {\n  std::cout << "Hello World!";\n  return 0;\n}`);
  const [output, setOutput] = useState('');

  if (!token) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8080/enquiry/getQues?${searchType}=${encodeURIComponent(searchValue)}`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!result.success) {
        handleError(result.message || 'Question not found.');
        setQuestion(null);
      } else {
        setQuestion(result.question);
        handleSuccess('Question fetched successfully.');
      }
    } catch (err) {
      console.error(err);
      handleError('Error fetching question.');
    }
  };

  const handleRun = async () => {
    const payload = { language: 'cpp', code };
    try {
      const { data } = await axios.post('http://localhost:8080/run', payload);
      setOutput(data.output);
    } catch (error) {
      console.error(error);
      setOutput('Error executing code.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-4">View Question Details</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block mb-1">Search Question By</label>
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
          <label className="block mb-1">
            Enter {searchType === 'id' ? 'Question ID' : 'Question Title'}
          </label>
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
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Question Details</h3>
            <p className="font-medium mt-2">Title:</p>
            <p className="bg-gray-800 border border-gray-700 px-3 py-2 rounded">{question.title}</p>
            <p className="font-medium mt-2">Description:</p>
            <p className="bg-gray-800 border border-gray-700 px-3 py-2 rounded whitespace-pre-line">{question.description}</p>
            <p className="font-medium mt-2">Difficulty:</p>
            <p className="bg-gray-800 border border-gray-700 px-3 py-2 rounded capitalize">{question.difficulty}</p>
          </div>

          {/* CODE EDITOR */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Write Your Code</h3>
            <div className="bg-gray-800 rounded p-2" style={{ height: '300px', overflowY: 'auto' }}>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) => highlight(code, languages.js)}
                padding={10}
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 14,
                  backgroundColor: '#1a202c',
                  color: 'white',
                  height: '100%',
                }}
              />
            </div>
            <button
              onClick={handleRun}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
              Run Code
            </button>
          </div>

          {/* OUTPUT DISPLAY */}
          {output && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded mt-4">
              <h4 className="font-semibold mb-2">Output:</h4>
              <pre className="whitespace-pre-wrap text-sm">{output}</pre>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ViewQuestion;

