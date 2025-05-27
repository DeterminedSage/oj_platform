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

app.post("/submit", async (req, res) => {
  const { language = "cpp", code, qid } = req.body;

  if (!code || !qid) {
    return res.status(400).json({ success: false, error: "Missing code or qid" });
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

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    for (let i = 0; i < question.testCases.length; i++) {
        const { input, output: expectedOutput } = question.testCases[i];

        const inputPath = path.join(outputDir, `${exeName}_${i}_input.txt`);
        fs.writeFileSync(inputPath, input, "utf-8");

        try {
            const actualOutput = await executeCpp(filePath, inputPath);

            const passed = actualOutput.trim() === expectedOutput.trim();

            results.push({
            testCase: i + 1,
            input,
            expected: expectedOutput.trim(),
            received: actualOutput.trim(),
            passed
            });

            fs.unlinkSync(inputPath);

            if (!passed) break; // 🚨 STOP at first failed test case

        } catch (err) {
            results.push({
            testCase: i + 1,
            input,
            expected: expectedOutput.trim(),
            received: err.message || "Runtime Error",
            passed: false
            });

            fs.unlinkSync(inputPath);
            break; // 🚨 STOP at first error
        }
    }


    // Cleanup
    fs.unlinkSync(filePath);
    const exePath = path.join(outputDir, `${exeName}.exe`);
    if (fs.existsSync(exePath)) fs.unlinkSync(exePath);

    res.json({ success: true, results });

  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, error: error.message || "Internal error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})