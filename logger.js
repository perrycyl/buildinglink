const { Console } = require("console");
const fs = require("fs");

// create new logger
const logger = () => {
    return new Console({
        stdout: fs.createWriteStream('mainlog.txt'),
        stderr: fs.createWriteStream('mainlog.txt')
    })
};

exports.logger = logger;