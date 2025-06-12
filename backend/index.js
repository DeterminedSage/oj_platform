const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { DBConnection } = require('./Models/db');
const Router = require('./Routes/Router');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const fs = require('fs');
const path = require('path');
const QuesModel = require('./Models/Question');
const { aiCodeReview } = require('./aiCodeReview');
const jwt = require("jsonwebtoken");
const UserModel = require("./Models/User");

DBConnection();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/auth', Router); 
app.use('/contribute', Router); 
app.use('/enquiry', Router);
app.use('/report', Router);
app.use('/user',Router);

app.post("/run", async (req, res) => {
    const { language = 'cpp', code , input } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }

    try {
        const filePath = await generateFile(language, code);
        console.log("Generated file path:", filePath);

        const outputDir = path.join(__dirname, "outputs");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const inputPath = path.join(__dirname, "outputs", `${path.basename(filePath).split(".")[0]}.txt`);
        fs.writeFileSync(inputPath, input || "", "utf-8");
        console.log("Input written to:", inputPath);

        const output = await executeCpp(filePath, inputPath);
        // console.log("Execution output:", output);

        res.json({ filePath, output });

        setTimeout(() => {
            fs.unlinkSync(filePath); // delete .cpp file
            fs.unlinkSync(inputPath); // delete input.txt
            const exePath = path.join(__dirname, "outputs", `${path.basename(filePath).split(".")[0]}.exe`);
            if (fs.existsSync(exePath)) fs.unlinkSync(exePath); // delete .exe file
        }, 5000);

    } catch (error) {
      console.error('Execution error:', error);
        const errMsg = typeof error === 'string' ? error : error.stderr || error.message || 'Unknown error';
        res.status(500).json({ success: false, error: errMsg });
    }
});

// app.post("/submit", async (req, res) => {
//   const { language = "cpp", code, qid } = req.body;

//   if (!code || !qid) {
//     return res.status(400).json({ success: false, error: "Missing code or qid" });
//   }

//   function normalizeOutput(output) {
//     return output
//       .split('\n')
//       .map(line => line.trim())    // Trim each line
//       .filter(line => line.length) // Remove empty lines (optional)
//       .join('\n');
//   }

//   try {
//     const question = await QuesModel.findOne({ qid });
//     if (!question) {
//       return res.status(404).json({ success: false, error: "Question not found" });
//     }

//     const results = [];
//     const filePath = await generateFile(language, code);
//     const exeName = path.basename(filePath).split(".")[0];
//     const outputDir = path.join(__dirname, "outputs");
//     if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

//     for (let i = 0; i < question.testCases.length; i++) {
//       const { input, output: expectedOutput } = question.testCases[i];
//       const inputPath = path.join(outputDir, `${exeName}_${i}_input.txt`);
//       fs.writeFileSync(inputPath, input, "utf-8");

//       try {
//         const actualOutput = await executeCpp(filePath, inputPath);
//         const passed = actualOutput.trim() === expectedOutput.trim();

//         results.push({
//           testCase: i + 1,
//           input,
//           expected: expectedOutput.trim(),
//           received: actualOutput.trim(),
//           passed,
//         });

//         fs.unlinkSync(inputPath);
//         if (!passed) break;
//       } catch (err) {
//         results.push({
//           testCase: i + 1,
//           input,
//           expected: expectedOutput.trim(),
//           received: err.message || "Runtime Error",
//           passed: false,
//         });

//         fs.unlinkSync(inputPath);
//         break;
//       }
//     }

//     const allPassed = results.every((r) => r.passed);
//     console.log("✅ All test cases passed:", allPassed);

//     if (allPassed) {
//       const token = req.headers.authorization?.split(" ")[1];
//       if (token) {
//         try {
//           const decoded = jwt.verify(token, process.env.JWT_SECRET);

//           const user = await UserModel.findById(decoded._id);
//           if (user) {
//             const questionObjectId = question._id;

//             const alreadySolved = user.solvedQuestions.some(
//               (qid) => qid.toString() === questionObjectId.toString()
//             );

//             if (!alreadySolved) {

//               user.solvedQuestions.push(questionObjectId);
//               user.questionsSolvedTotal++;

//               if (question.difficulty === "easy") user.questionsSolvedEasy++;
//               else if (question.difficulty === "medium") user.questionsSolvedMedium++;
//               else if (question.difficulty === "hard") user.questionsSolvedHard++;

//               await user.save();
//             } else {
//               console.log("🛑 Question already solved by user");
//             }
//           } else {
//             console.error("❌ User not found in DB");
//           }
//         } catch (err) {
//           console.error("🔐 JWT error or user not found:", err.message);
//         }
//       } else {
//         console.error("❌ No token provided in headers");
//       }
//     }

//     // 🧹 Cleanup
//     fs.unlinkSync(filePath);
//     const exePath = path.join(outputDir, `${exeName}.exe`);
//     if (fs.existsSync(exePath)) fs.unlinkSync(exePath);

//     res.json({ success: true, results });

//   } catch (error) {
//     console.error("❗ Submission error:", error);
//     res.status(500).json({ success: false, error: error.message || "Internal error" });
//   }
// });

app.post("/submit", async (req, res) => {
  const { language = "cpp", code, qid } = req.body;

  if (!code || !qid) {
    return res.status(400).json({ success: false, error: "Missing code or qid" });
  }

  // 🧽 Normalize output to avoid false negatives due to whitespace
  function normalizeOutput(output) {
    return output
      .split('\n')
      .map(line => line.trim())    // Trim each line
      .filter(line => line.length) // Remove empty lines (optional)
      .join('\n');
  }

  try {
    const question = await QuesModel.findOne({ qid });
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }

    const results = [];
    const filePath = await generateFile(language, code);
    const exeName = path.basename(filePath).split(".")[0];
    const outputDir = path.join(__dirname, "outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    for (let i = 0; i < question.testCases.length; i++) {
      const { input, output: expectedOutput } = question.testCases[i];
      const inputPath = path.join(outputDir, `${exeName}_${i}_input.txt`);
      fs.writeFileSync(inputPath, input, "utf-8");

      try {
        const actualOutput = await executeCpp(filePath, inputPath);

        const normalizedExpected = normalizeOutput(expectedOutput);
        const normalizedActual = normalizeOutput(actualOutput);
        const passed = normalizedExpected === normalizedActual;

        results.push({
          testCase: i + 1,
          input,
          expected: normalizedExpected,
          received: normalizedActual,
          passed,
        });

        fs.unlinkSync(inputPath);
        if (!passed) break;

      } catch (err) {
        results.push({
          testCase: i + 1,
          input,
          expected: normalizeOutput(expectedOutput),
          received: err.message || "Runtime Error",
          passed: false,
        });

        fs.unlinkSync(inputPath);
        break;
      }
    }

    const allPassed = results.every((r) => r.passed);
    console.log("✅ All test cases passed:", allPassed);

    if (allPassed) {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await UserModel.findById(decoded._id);

          if (user) {
            const questionObjectId = question._id;
            const alreadySolved = user.solvedQuestions.some(
              (qid) => qid.toString() === questionObjectId.toString()
            );

            if (!alreadySolved) {
              user.solvedQuestions.push(questionObjectId);
              user.questionsSolvedTotal++;

              if (question.difficulty === "easy") user.questionsSolvedEasy++;
              else if (question.difficulty === "medium") user.questionsSolvedMedium++;
              else if (question.difficulty === "hard") user.questionsSolvedHard++;

              await user.save();
            } else {
              console.log("🛑 Question already solved by user");
            }
          } else {
            console.error("❌ User not found in DB");
          }
        } catch (err) {
          console.error("🔐 JWT error or user not found:", err.message);
        }
      } else {
        console.error("❌ No token provided in headers");
      }
    }

    // 🧹 Cleanup
    fs.unlinkSync(filePath);
    const exePath = path.join(outputDir, `${exeName}.exe`);
    if (fs.existsSync(exePath)) fs.unlinkSync(exePath);

    res.json({ success: true, results });

  } catch (error) {
    console.error("❗ Submission error:", error);
    res.status(500).json({ success: false, error: error.message || "Internal error" });
  }
});


app.post("/ai-review", async (req, res) => {
    const { code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const review = await aiCodeReview(code);
        res.json({ "review": review });
    } catch (error) {
        res.status(500).json({ error: "Error in AI review, error: " + error.message });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})