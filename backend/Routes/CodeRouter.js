const express = require("express");
const { authMiddleware } = require("../Middlewares/AuthValidation");
const { validateRunCode, validateSubmitCode, validateAICodeReview } = require("../Middlewares/CodeValidation");
const { handleRunCode, handleSubmitCode, handleAICodeReview } = require("../Controllers/CodeController");
const router = express.Router();

router.post("/run",authMiddleware ,validateRunCode,handleRunCode);
router.post("/submit",authMiddleware,validateSubmitCode,handleSubmitCode);
router.post("/ai-review",authMiddleware,validateAICodeReview,handleAICodeReview);

module.exports = router;