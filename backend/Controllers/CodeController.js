const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const { executeCode } = require("../executeCode");
const { generateFile } = require("../generateFile");
const { aiCodeReview } = require("../aiCodeReview");
const QuesModel = require("../Models/Question");
const UserModel = require("../Models/User");

const { normalizeOutput } = require("../utils/normalizeOutput");
const { cleanupJobDir, cleanupOutputFiles } = require("../utils/cleanup");

exports.runCode = async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (!code) return res.status(400).json({ success: false, error: "Empty code!" });

  try {
    const { filePath, jobID, jobDir } = await generateFile(language, code);
    const inputPath = path.join(jobDir, "input.txt");
    fs.writeFileSync(inputPath, input || "", "utf-8");

    const output = await executeCode(language, filePath, inputPath);
    res.json({ jobID, output });

    setTimeout(() => cleanupJobDir(jobDir), 5000);

  } catch (err) {
    const errMsg = err.stderr || err.message || "Execution failed";
    res.status(500).json({ success: false, error: errMsg });
  }
};

exports.submitCode = async (req, res) => {
  const { language = "cpp", code, qid } = req.body;
  if (!code || !qid) return res.status(400).json({ success: false, error: "Missing code or qid" });

  try {
    const question = await QuesModel.findOne({ qid });
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });

    const { filePath } = await generateFile(language, code);
    const jobId = path.basename(filePath).split(".")[0];
    const outputDir = path.join(__dirname, "../routes/outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const results = [];

    for (let i = 0; i < question.testCases.length; i++) {
      const { input, output: expectedOutput } = question.testCases[i];
      const inputPath = path.join(outputDir, `${jobId}_${i}_input.txt`);
      fs.writeFileSync(inputPath, input, "utf-8");

      try {
        const actualOutput = await executeCode(language, filePath, inputPath);

        results.push({
          testCase: i + 1,
          input,
          expected: normalizeOutput(expectedOutput),
          received: normalizeOutput(actualOutput),
          passed: normalizeOutput(expectedOutput) === normalizeOutput(actualOutput),
        });

        fs.unlinkSync(inputPath);
        if (!results.at(-1).passed) break;

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

    if (allPassed) {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await UserModel.findById(decoded._id);

          if (user) {
            const qObjId = question._id.toString();
            if (!user.solvedQuestions.includes(qObjId)) {
              user.solvedQuestions.push(question._id);
              user.questionsSolvedTotal++;
              if (question.difficulty === "easy") user.questionsSolvedEasy++;
              if (question.difficulty === "medium") user.questionsSolvedMedium++;
              if (question.difficulty === "hard") user.questionsSolvedHard++;
              await user.save();
            }
          }
        } catch (err) {
          console.error("JWT error:", err.message);
        }
      }
    }

    cleanupOutputFiles(filePath, jobId, outputDir);
    res.json({ success: true, results });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.reviewCodeAI = async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, error: "Empty code!" });

  try {
    const review = await aiCodeReview(code);
    res.json({ review });
  } catch (err) {
    res.status(500).json({ success: false, error: `AI review failed: ${err.message}` });
  }
};
