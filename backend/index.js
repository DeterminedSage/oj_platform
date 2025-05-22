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

// app.post("/run", async (req, res) => {
//     // const language = req.body.language;
//     // const code = req.body.code;

//     const { language = 'cpp', code } = req.body;
//     if (code === undefined) {
//         return res.status(404).json({ success: false, error: "Empty code!" });
//     }
//     try {
//         const filePath = await generateFile(language, code);
//         const output = await executeCpp(filePath);
//         res.json({ filePath, output });
//     } catch (error) {
//         res.status(500).json({ error: error });
//     }
// });

app.post("/run", async (req, res) => {
    const { language = 'cpp', code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }

    try {
        const filePath = await generateFile(language, code);
         console.log("Generated file path:", filePath);
        const output = await executeCpp(filePath);
         console.log("Execution output:", output);
        res.json({ filePath, output });
    } catch (error) {
      console.error('Execution error:', error);
        const errMsg = typeof error === 'string' ? error : error.stderr || error.message || 'Unknown error';
        res.status(500).json({ success: false, error: errMsg });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})