import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // Add this line for VS Code-like dark theme
import { handleError } from '../utils';
import { ToastContainer } from 'react-toastify';

function QuestionDetails() {
  const { qid } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/enquiry/getQues?id=${qid}`);
        console.log("Fetched question:", res);
        setQuestion(res.data.question);
      } catch (err) {
        console.error("Failed to fetch question:", err);
      }
    };

    fetchQuestion();
  }, [qid]);

  const handleRun = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleError("Login to test code");
      return;
    }
    try {
      const payload = { language: 'cpp', code, input };
      const { data } = await axios.post('http://localhost:8080/run', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOutput(data.output);
    } catch (error) {
      console.error(error);
      setOutput('Error executing code.');
    }
  };

  if (!question) return (
    <div className="bg-gray-800 min-h-screen">
      <div className="p-6 pl-16">Loading...</div>
    </div>
  );

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="p-6 pl-16 text-gray-100">
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <p className="text-gray-400 mb-4">QID: {question.qid} | Difficulty: <span className={`capitalize ${
          question.difficulty === 'easy' ? 'text-green-400' :
          question.difficulty === 'medium' ? 'text-yellow-400' :
          'text-red-400'
        }`}>{question.difficulty}</span></p>
        <p className="mb-6">{question.description}</p>

        <h2 className="text-xl font-semibold mb-2">Test Cases:</h2>
        <ul className="list-disc pl-6 space-y-2">
          {question.testCases.map((tc, idx) => (
            <li key={idx}>
              <strong>Input:</strong> {tc.input} <br />
              <strong>Output:</strong> {tc.output}
            </li>
          ))}
        </ul>

        {/* CODE EDITOR AND RUNNER */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Write Your Code</h3>
          <div className="bg-gray-800 rounded p-2">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                backgroundColor: '#1a202c',
                color: 'white',
                minHeight: 100,
                width: '100%',
                overflow: 'auto',
                resize: 'vertical',
              }}
            />
          </div>
          <div className="mt-4">
            <label className="block mb-1 font-medium text-gray-300">Custom Input (stdin):</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here (used as stdin)"
              className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-black"
              rows={4}
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
        <ToastContainer/>
    </div>
  );
}

export default QuestionDetails;
