const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const QuesModel = require("../Models/Question");
const UserModel = require("../Models/User");

const { generateFile } = require("../Compiler/generateFile");
const { executeCode } = require("../Compiler/executeCode");
const { aiCodeReview } = require("../Compiler/aiCodeReview");

const normalizeOutput = (str) =>
  str.split("\n").map(line => line.trim()).filter(Boolean).join("\n");

const handleRunCode = async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  try {
    const { filePath, jobID, jobDir } = await generateFile(language, code);
    const inputPath = path.join(jobDir, "input.txt");
    fs.writeFileSync(inputPath, input, "utf-8");

    const output = await executeCode(language, filePath, inputPath);
    res.json({ jobID, output });

    setTimeout(() => {
      if (fs.existsSync(jobDir)) fs.rmSync(jobDir, { recursive: true, force: true });
    }, 5000);
  } catch (error) {
    res.status(500).json({ success: false, error: error.stderr || error.message });
  }
};

const handleSubmitCode = async (req, res) => {
  const { language = "cpp", code, qid } = req.body;

  try {
    const question = await QuesModel.findOne({ qid });
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });

    const { filePath } = await generateFile(language, code);
    const jobId = path.basename(filePath).split(".")[0];
    const outputDir = path.join(__dirname, "..", "outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const results = [];

    for (let i = 0; i < question.testCases.length; i++) {
      const { input, output: expected } = question.testCases[i];
      const inputPath = path.join(outputDir, `${jobId}_${i}_input.txt`);
      fs.writeFileSync(inputPath, input, "utf-8");

      try {
        const actualOutput = await executeCode(language, filePath, inputPath);
        const passed = normalizeOutput(actualOutput) === normalizeOutput(expected);

        results.push({
          testCase: i + 1,
          input,
          expected: normalizeOutput(expected),
          received: normalizeOutput(actualOutput),
          passed,
        });

        fs.unlinkSync(inputPath);
        if (!passed) break;

      } catch (err) {
        results.push({
          testCase: i + 1,
          input,
          expected: normalizeOutput(expected),
          received: err.stderr || err.message,
          passed: false,
        });

        fs.unlinkSync(inputPath);
        break;
      }
    }

    // update user progress if all passed
    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await UserModel.findById(decoded._id);
          if (user) {
            const qidStr = question._id.toString();
            if (!user.solvedQuestions.includes(qidStr)) {
              user.solvedQuestions.push(question._id);
              user.questionsSolvedTotal++;
              if (question.difficulty === "easy") user.questionsSolvedEasy++;
              if (question.difficulty === "medium") user.questionsSolvedMedium++;
              if (question.difficulty === "hard") user.questionsSolvedHard++;
              await user.save();
            }
          }
        } catch (err) {
          console.warn("JWT error:", err.message);
        }
      }
    }

    // Cleanup
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      const exePath = path.join(outputDir, `${jobId}.exe`);
      const classPath = filePath.replace(".java", ".class");
      if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      if (fs.existsSync(classPath)) fs.unlinkSync(classPath);
    } catch (e) {
      console.warn("Cleanup error:", e.message);
    }

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const handleAICodeReview = async (req, res) => {

  const { code , user } = req.body;

  try {
    const review = await aiCodeReview(code,user);
    res.json({ review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  handleRunCode,
  handleSubmitCode,
  handleAICodeReview,
};
