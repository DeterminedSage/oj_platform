// const { exec } = require("child_process");
// const path = require("path");
// const fs = require("fs");

// const outputPath = path.join(__dirname, "outputs");

// const ensureDirExists = () => {
//     if (!fs.existsSync(outputPath)) {
//         fs.mkdirSync(outputPath, { recursive: true });
//     }
// };

// const executeCode = (language, filepath, inputPath) => {
//     ensureDirExists();
//     const jobId = path.basename(filepath).split(".")[0];
//     const exePath = path.join(outputPath, `${jobId}.exe`);

//     let compileCommand, runCommand;

//     switch (language) {
//         case "cpp":
//             compileCommand = `g++ "${filepath}" -o "${exePath}"`;
//             runCommand = `"${exePath}" < "${inputPath}"`;
//             break;
//         case "java":
//             compileCommand = `javac "${filepath}"`;
//             runCommand = `java -cp "${path.dirname(filepath)}" Main < "${inputPath}"`;
//             break;
//         case "py":
//         case "python":
//             compileCommand = null; 
//             runCommand = `python3 "${filepath}" < "${inputPath}"`;
//             console.log(runCommand);
//             break;
//         default:
//             return Promise.reject("Unsupported language");
//     }

//     const fullCommand = compileCommand ? `${compileCommand} && ${runCommand}` : runCommand;

//     return new Promise((resolve, reject) => {
//         exec(fullCommand, (error, stdout, stderr) => {
//             if (error) return reject({ error: error.message, stderr });
//             if (stderr) return reject({ error: "Runtime error", stderr });
//             resolve(stdout);
//         });
//     });
// };

// module.exports = { executeCode };


const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const outputPath = path.join(__dirname, "outputs");

const ensureDirExists = () => {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
};

const executeCode = (language, filepath, inputPath) => {
    ensureDirExists();
    const jobId = path.basename(filepath).split(".")[0];
    const exePath = path.join(outputPath, `${jobId}.exe`);

    let compileCommand, runCommand;

    switch (language) {
        case "cpp":
            compileCommand = `g++ "${filepath}" -o "${exePath}"`;
            runCommand = `"${exePath}" < "${inputPath}"`;
            break;
        case "java":
            compileCommand = `javac "${filepath}"`;
            runCommand = `java -cp "${path.dirname(filepath)}" Main < "${inputPath}"`;
            break;
        case "py":
        case "python":
            compileCommand = null;
            runCommand = `python3 "${filepath}" < "${inputPath}"`;
            break;
        default:
            return Promise.reject("Unsupported language");
    }

    const fullCommand = compileCommand ? `${compileCommand} && ${runCommand}` : runCommand;

    return new Promise((resolve, reject) => {
        // 5-second timeout to guard against infinite loops
        exec(fullCommand, { timeout: 5000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return reject({ error: "Execution time limit exceeded", stderr: "" });
                }
                return reject({ error: error.message, stderr });
            }

            if (stderr) {
                return reject({ error: "Runtime error", stderr });
            }

            resolve(stdout);
        });
    });
};

module.exports = { executeCode };

