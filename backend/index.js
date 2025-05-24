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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})