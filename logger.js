const { Console } = require("console");
const fs = require("fs");

// create new logger
function logger() {
    return new Console({
        stdout: fs.createWriteStream('mainlog.txt'),
        stderr: fs.createWriteStream('mainlog.txt'),
        colorMode: true,
        
    })
};

module.exports = {
    logger,
}