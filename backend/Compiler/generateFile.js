const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const generateFile = async (format, content) => {
    const jobID = uuid();
    const jobDir = path.join(dirCodes, jobID);
    ensureDirExists(jobDir);

    const filename = format === "java" ? "Main.java" : `${jobID}.${format}`;
    const filePath = path.join(jobDir, filename);

    await fs.writeFileSync(filePath, content);
    return { filePath, jobID, jobDir };
};

module.exports = {
    generateFile,
};


