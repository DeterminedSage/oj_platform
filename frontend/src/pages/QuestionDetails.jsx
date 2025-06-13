import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { handleError } from '../utils';
import { ToastContainer } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

function QuestionDetails() {
  const { qid } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [aiReview, setAiReview] = useState('');
  const [leftWidth, setLeftWidth] = useState('40%'); // Default width for the left column set to 30%
  const [topHeight, setTopHeight] = useState('50%'); // Default height for the top section of the right column

  const resizerRef = useRef(null);
  const containerRef = useRef(null);

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
        headers: { Authorization: `Bearer ${token}` } // Fixed string interpolation
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
        headers: { Authorization: `Bearer ${token}` } // Fixed string interpolation
      });

      setSubmissionResult(data.results);
    } catch (error) {
      console.error(error);
      setSubmissionResult(null);
    }
  };

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

  const isAccepted = submissionResult && submissionResult.every(r => r.passed);

  const startDragging = (e) => {
    e.preventDefault();
    const container = containerRef.current;

    const onMouseMove = (event) => {
      const newWidth = Math.max(250, Math.min(event.clientX - container.offsetLeft, container.offsetWidth - 250));
      setLeftWidth(`${newWidth}px`);
    };

    const stopDragging = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopDragging);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDragging);
  };

  const startDraggingHorizontal = (e) => {
    e.preventDefault();
    const container = containerRef.current;

    const onMouseMove = (event) => {
      const newHeight = Math.max(100, Math.min(event.clientY - container.offsetTop, container.offsetHeight - 100));
      setTopHeight(`${newHeight}px`);
    };

    const stopDragging = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopDragging);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDragging);
  };

  if (!question) return (
    <div className="bg-gray-800 min-h-screen">
      <div className="p-6 pl-16">Loading...</div>
    </div>
  );

  return (
  <div className="bg-gray-800 min-h-screen text-gray-100 p-4">
    <div ref={containerRef} className="flex h-[120vh]">

      {/* LEFT COLUMN */}
      <div
        className="bg-gray-900 p-4 overflow-y-auto"
        style={{ width: leftWidth, minWidth: '250px', transition: 'width 0.2s ease' }}
      >
        <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
        <p className="text-sm text-gray-400 mb-4">
          QID: {question.qid} | Difficulty:
          <span className={`ml-2 capitalize ${
            question.difficulty === 'easy' ? 'text-green-400' :
            question.difficulty === 'medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>{question.difficulty}</span>
        </p>
        <div style={{ whiteSpace: 'pre-line' }}>{question.description}</div>

        <h2 className="text-lg font-semibold mt-4 mb-2">Test Cases:</h2>
        <ul className="list-disc pl-6 space-y-3">
          {question.testCases.map((tc, idx) => (
            <li key={idx}>
              <strong>Input:</strong>
              <div className="bg-gray-800 text-white p-2 rounded border border-gray-600 whitespace-pre-line">
                {tc.input}
              </div>
              <br/> {/* Add spacing */}
              <strong>Output:</strong>
              <div className="bg-gray-800 text-white p-2 rounded border border-gray-600 whitespace-pre-line">
                {tc.output}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={resizerRef}
        onMouseDown={startDragging}
        className="cursor-col-resize w-1 bg-gray-700"
        style={{ zIndex: 10 }}
      />

      {/* RIGHT COLUMN */}
      <div className="flex-1 flex flex-col">
        {/* TOP: EDITOR AREA */}
        <div
          className="bg-gray-900 p-2 rounded border border-gray-700 overflow-auto"
          style={{ height: topHeight, transition: 'height 0.2s ease' }}
        >
          <div className="overflow-x-auto">
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
                width: '100%',
                minHeight: '300px', // Set a reasonable default height
                whiteSpace: 'pre', // Prevent text wrapping
                overflowX: 'auto', // Enable horizontal scrolling
                overflowY: 'auto', // Enable vertical scrolling (fixed duplicate key)
                borderRadius: 6,
              }}
            />
          </div>
        </div>

        <div
          onMouseDown={startDraggingHorizontal}
          className="cursor-row-resize h-1 bg-gray-700"
          style={{ zIndex: 10 }}
        />

        {/* BOTTOM: ACTIONS + I/O + AI REVIEW */}
        <div className="flex-1 bg-gray-900 p-4 rounded border border-gray-700 overflow-auto">
          <div className="grid grid-cols-2 gap-4 mb-4">
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

          <div className="flex gap-4 mb-4">
            <button onClick={handleRun} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
              Run Code
            </button>
            <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
              Submit
            </button>
            <button
              onClick={handleAiReview}
              disabled={!isAccepted}
              className={`px-4 py-2 rounded text-white ${
                isAccepted ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Jiraiya's Overview
            </button>
          </div>

          {/* AI REVIEW + SUBMISSION RESULT */}
          {aiReview && (
            <div className="mb-4 bg-gray-800 p-3 rounded border border-purple-700 text-purple-100 max-h-[200px] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">Jiraiya's overview</h3>
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="prose prose-invert mb-2" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                  pre: ({node, ...props}) => <pre className="bg-gray-900 p-2 rounded" {...props} />,
                  code: ({node, ...props}) => <code className="bg-gray-800 text-sm px-1 py-0.5 rounded" {...props} />
                }}
              >
                {aiReview}
              </ReactMarkdown>
            </div>
          )}

          {submissionResult && (
            <div className="bg-gray-800 p-4 rounded border border-gray-700 text-gray-100 max-h-[250px] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-3">
                {submissionResult.every(r => r.passed)
                  ? '✅ All Test Cases Passed!'
                  : `❌ Failed at Test Case ${submissionResult.findIndex(r => !r.passed) + 1}`}
              </h3>
              <div className="space-y-4">
                {submissionResult.map((res, idx) => (
                  <div key={idx} className="p-3 bg-gray-900 border border-gray-700 rounded">
                    <p><strong>Test Case #{res.testCase}</strong></p>
                    <p><strong>Input:</strong></p>
                    <pre className="bg-gray-800 p-2 rounded text-sm whitespace-pre-wrap">{res.input}</pre>
                    <br/>
                    <p><strong>Expected Output:</strong></p>
                    <pre className="bg-gray-800 p-2 rounded text-sm whitespace-pre-wrap">{res.expected}</pre>
                    <br/>
                    <p><strong>Received Output:</strong></p>
                    <pre className="bg-gray-800 p-2 rounded text-sm whitespace-pre-wrap">{res.received}</pre>
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
      </div>
    </div>
    <ToastContainer />
  </div>
);

}

export default QuestionDetails;

