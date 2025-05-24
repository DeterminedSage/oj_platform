import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function QuestionDetails() {
  const { qid } = useParams();
  const [question, setQuestion] = useState(null);

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
      </div>
    </div>
  );
}

export default QuestionDetails;
