const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
// }

const ensureDirExists = () => {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
};

// const executeCpp = (filepath) => {
//     const jobId = path.basename(filepath).split(".")[0];
//     const outPath = path.join(outputPath, `${jobId}.exe`);

//     return new Promise((resolve, reject) => {
//         exec(
//             `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`,
//             (error, stdout, stderr) => {
//                 if (error) {
//                     reject({ error, stderr });
//                 }
//                 if (stderr) {
//                     reject(stderr);
//                 }
//                 resolve(stdout);
//             }
//         );
//     });
// };

const executeCpp = (filepath) => {
    ensureDirExists();
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    const command = process.platform === "win32"
        ? `g++ "${filepath}" -o "${outPath}" && "${outPath}"`
        : `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`;

    return new Promise((resolve, reject) => {
        exec(command,
            (error, stdout, stderr) => {
                if (error) {
                    return reject({ error: error.message, stderr });
                }
                if (stderr) {
                    return reject({ error: "Runtime error", stderr });
                }
                resolve(stdout);
            }
        );
    });
};


module.exports = {
    executeCpp,
};