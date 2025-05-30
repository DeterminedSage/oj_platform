import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { handleError } from '../utils';
import { ToastContainer } from 'react-toastify';

function QuestionDetails() {
  const { qid } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [aiReview, setAiReview] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/enquiry/getQues?id=${qid}`);
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

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("Login to test code");
      return;
    }

    try {
      const payload = {
        language: 'cpp',
        code,
        qid: question.qid
      };

      const { data } = await axios.post("http://localhost:8080/submit", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmissionResult(data.results);
    } catch (error) {
      console.error(error);
      setSubmissionResult(null);
    }
  };

  // const handleAiOverview = () => {
  //   alert("✅ AI Overview triggered for accepted solution!"); // Replace with real logic
  // };

  const handleAiReview = async () => {
    const payload = {
      code
    };

    try {
      const { data } = await axios.post('http://localhost:8080/ai-review', payload);
      setAiReview(data.review);
    } catch (error) {
      setAiReview('Error in AI review, error: ' + error.message);
    };
  };

  const isAccepted = submissionResult && submissionResult.every(r => r.passed); // ⭐

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
              highlight={code =>
                Prism.highlight(code, Prism.languages.javascript, 'javascript')
              }
              padding={12}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                backgroundColor: '#1a202c',
                color: '#f8f8f2',
                lineHeight: 1.5,
                minHeight: 120,
                width: '100%',
                overflowX: 'auto',
                whiteSpace: 'pre',
                borderRadius: 6,
                resize: 'vertical',
              }}
            />
          </div>

          {/* INPUT & OUTPUT side-by-side */}
          <div className="mt-4 grid grid-cols-2 gap-4"> {/* ⭐ Two-column layout */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">Custom Input (stdin):</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here (used as stdin)"
                className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-black"
                rows={4}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-300">Output:</label>
              <div className="bg-gray-900 text-white p-2 rounded border border-gray-600 h-[88px] overflow-auto text-sm whitespace-pre-wrap">
                {output || 'Output will appear here...'}
              </div>
            </div>
          </div>

          {/* {aiReview && (
  <div className="mt-4 bg-gray-900 p-4 rounded border border-purple-700 text-purple-100">
    <h3 className="text-lg font-semibold mb-2">🧠 AI Review</h3>
    <p className="whitespace-pre-wrap">{aiReview}</p>
  </div>
)} */}

          {/* Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleRun}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
              Run Code
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Submit
            </button>
            <button
              onClick={handleAiReview}
              disabled={!isAccepted} // ⭐
              className={`px-4 py-2 rounded text-white ${
                isAccepted ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              AI Overview
            </button>
          </div>
        </div>

                  {aiReview && (
  <div className="mt-4 bg-gray-900 p-4 rounded border border-purple-700 text-purple-100">
    <h3 className="text-lg font-semibold mb-2">🧠 AI Review</h3>
    <p className="whitespace-pre-wrap">{aiReview}</p>
  </div>
)}

        {/* SUBMISSION RESULTS */}
        {submissionResult && (
          <div className="mt-6 bg-gray-900 p-4 rounded border border-gray-700 text-gray-100">
            <h3 className="text-xl font-semibold mb-3">
              {submissionResult.every(r => r.passed)
                ? '✅ All Test Cases Passed!'
                : `❌ Failed at Test Case ${submissionResult.findIndex(r => !r.passed) + 1}`}
            </h3>
            <div className="space-y-4">
              {submissionResult.map((res, idx) => (
                <div key={idx} className="p-3 bg-gray-800 border border-gray-700 rounded">
                  <p><strong>Test Case #{res.testCase}</strong></p>
                  <p><strong>Input:</strong></p>
                  <pre className="bg-gray-700 p-2 rounded text-sm whitespace-pre-wrap">{res.input}</pre>

                  <p><strong>Expected Output:</strong></p>
                  <pre className="bg-gray-700 p-2 rounded text-sm whitespace-pre-wrap">{res.expected}</pre>

                  <p><strong>Received Output:</strong></p>
                  <pre className="bg-gray-700 p-2 rounded text-sm whitespace-pre-wrap">{res.received}</pre>

                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={res.passed ? "text-green-400" : "text-red-400"}>
                      {res.passed ? 'Passed' : 'Failed'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default QuestionDetails;










