const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

const ensureDirExists = () => {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
};

// const executeCpp = (filepath) => {
//     ensureDirExists();
//     const jobId = path.basename(filepath).split(".")[0];
//     const outPath = path.join(outputPath, `${jobId}.exe`);
//     const inputPath = path.join(outputPath, "input.txt"); // 👈 expects input.txt in outputs/

//     const compileCommand =
//         process.platform === "win32"
//             ? `g++ "${filepath}" -o "${outPath}"`
//             : `g++ ${filepath} -o ${outPath}`;

//     // Run the program with input redirection from input.txt
//     const runCommand =
//         process.platform === "win32"
//             ? `"${outPath}" < "${inputPath}"`
//             : `cd ${outputPath} && ./${jobId}.exe < input.txt`;

//     const fullCommand = `${compileCommand} && ${runCommand}`;

//     return new Promise((resolve, reject) => {
//         exec(fullCommand, (error, stdout, stderr) => {
//             if (error) {
//                 return reject({ error: error.message, stderr });
//             }
//             if (stderr) {
//                 return reject({ error: "Runtime error", stderr });
//             }
//             resolve(stdout);
//         });
//     });
// };

const executeCpp = (filepath, inputPath) => {
    ensureDirExists();
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    const compileCommand =
        process.platform === "win32"
            ? `g++ "${filepath}" -o "${outPath}"`
            : `g++ ${filepath} -o ${outPath}`;

    const runCommand =
        process.platform === "win32"
            ? `"${outPath}" < "${inputPath}"`
            : `"${outPath}" < "${inputPath}"`;

    const fullCommand = `${compileCommand} && ${runCommand}`;

    return new Promise((resolve, reject) => {
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                return reject({ error: error.message, stderr });
            }
            if (stderr) {
                return reject({ error: "Runtime error", stderr });
            }
            resolve(stdout);
        });
    });
};


module.exports = {
    executeCpp,
};
