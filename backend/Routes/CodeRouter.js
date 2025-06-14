// const { aiCodeReview } = require("../aiCodeReview");
// const { executeCode } = require("../executeCode");
// const { generateFile } = require("../generateFile");
// const QuesModel = require("../Models/Question");
// require('dotenv').config();
// const fs = require('fs');
// const path = require('path');
// const jwt = require("jsonwebtoken");

// const router = require('express').Router();

// router.post("/run", async (req, res) => {
//     const { language = 'cpp', code, input } = req.body;

//     if (!code) {
//         return res.status(400).json({ success: false, error: "Empty code!" });
//     }

//     try {
//         // Step 1: Generate code file and isolated jobDir
//         const { filePath, jobID, jobDir } = await generateFile(language, code);
//         console.log("Generated file path:", filePath);

//         // Step 2: Create input file inside the jobDir
//         const inputPath = path.join(jobDir, 'input.txt');
//         fs.writeFileSync(inputPath, input || "", "utf-8");
//         console.log("Input written to:", inputPath);

//         // Step 3: Run the code
//         const output = await executeCode(language, filePath, inputPath);

//         // Step 4: Send result
//         res.json({ jobID, output });

//         // Step 5: Cleanup - remove the entire job folder after timeout
//         setTimeout(() => {
//             try {
//                 if (fs.existsSync(jobDir)) {
//                     fs.rmSync(jobDir, { recursive: true, force: true });
//                     console.log(`Cleaned up job directory: ${jobDir}`);
//                 }
//             } catch (err) {
//                 console.warn("Cleanup error:", err.message);
//             }
//         }, 5000);

//     } catch (error) {
//         console.error('Execution error:', error);
//         const errMsg = typeof error === 'string' ? error : error.stderr || error.message || 'Unknown error';
//         res.status(500).json({ success: false, error: errMsg });
//     }
// });

// router.post("/submit", async (req, res) => {
//   const { language = "cpp", code, qid } = req.body;

//   if (!code || !qid) {
//     return res.status(400).json({ success: false, error: "Missing code or qid" });
//   }

//   function normalizeOutput(output) {
//     return output
//       .split('\n')
//       .map(line => line.trim())
//       .filter(line => line.length)
//       .join('\n');
//   }

//   try {
//     const question = await QuesModel.findOne({ qid });
//     if (!question) {
//       return res.status(404).json({ success: false, error: "Question not found" });
//     }

//     const results = [];
//     const {filePath} = await generateFile(language, code);
//     const jobId = path.basename(filePath).split(".")[0];
//     const outputDir = path.join(__dirname, "outputs");
//     if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

//     for (let i = 0; i < question.testCases.length; i++) {
//       const { input, output: expectedOutput } = question.testCases[i];
//       const inputPath = path.join(outputDir, `${jobId}_${i}_input.txt`);
//       fs.writeFileSync(inputPath, input, "utf-8");

//       try {
//         const actualOutput = await executeCode(language, filePath, inputPath);

//         const normalizedExpected = normalizeOutput(expectedOutput);
//         const normalizedActual = normalizeOutput(actualOutput);
//         const passed = normalizedExpected === normalizedActual;

//         results.push({
//           testCase: i + 1,
//           input,
//           expected: normalizedExpected,
//           received: normalizedActual,
//           passed,
//         });

//         fs.unlinkSync(inputPath);
//         if (!passed) break;

//       } catch (err) {
//         results.push({
//           testCase: i + 1,
//           input,
//           expected: normalizeOutput(expectedOutput),
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
//     try {
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//       const exePath = path.join(outputDir, `${jobId}.exe`);
//       const classPath = filePath.replace(".java", ".class");

//       if (fs.existsSync(exePath)) fs.unlinkSync(exePath);       // C++
//       if (fs.existsSync(classPath)) fs.unlinkSync(classPath);   // Java
//     } catch (err) {
//       console.warn("⚠️ Cleanup warning:", err.message);
//     }

//     res.json({ success: true, results });

//   } catch (error) {
//     console.error("❗ Submission error:", error);
//     res.status(500).json({ success: false, error: error.message || "Internal error" });
//   }
// });



// router.post("/ai-review", async (req, res) => {
//     const { code } = req.body;
//     if (code === undefined) {
//         return res.status(404).json({ success: false, error: "Empty code!" });
//     }
//     try {
//         const review = await aiCodeReview(code);
//         res.json({ "review": review });
//     } catch (error) {
//         res.status(500).json({ error: "Error in AI review, error: " + error.message });
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

router.post("/run", runCode);
router.post("/submit", submitCode);
router.post("/ai-review", reviewCodeAI);

module.exports = router;