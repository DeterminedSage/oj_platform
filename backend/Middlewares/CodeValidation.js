const validateLanguage = (language) => {
  const validLanguages = ["cpp", "java", "python"];
  if (!validLanguages.includes(language)) {
    return false;
  }
  return true;
};

const validateRunCode = (req, res, next) => {
  const { code, language } = req.body;
    // console.log(req);
  if (!code) return res.status(400).json({ success: false, error: "Code is required" });
  if (!validateLanguage(language)) return res.status(400).json({ success: false, error: "Language doesn't exist" });
  next();
};

const validateSubmitCode = (req, res, next) => {
  const { code, qid, language } = req.body;
  // console.log(req);
  if (!code || !qid) {
    return res.status(400).json({ success: false, error: "Code and Question ID are required" });
  }
  if (!validateLanguage(language)) return res.status(400).json({ success: false, error: "Language doesn't exist" });
  next();
};

const validateAICodeReview = (req, res, next) => {
  // console.log(req.body);
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ success: false, error: "Code is required" });
  next();
};

module.exports = { validateRunCode, validateSubmitCode, validateAICodeReview };