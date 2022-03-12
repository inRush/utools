const fs = require('fs');
const open = require('open')
const path = require('path')

function isTextFile(filepath, length) {
    const fd = fs.openSync(filepath, 'r');
    length = length || 1000;
    for (let i = 0; i < length; i++) {
        const buf = new Buffer(1);
        const bytes = fs.readSync(fd, buf, 0, 1, i);
        const char = buf.toString().charCodeAt(0);
        if (bytes === 0) {
            return true;
        } else if (bytes === 1 && char === 0) {
            return false;
        }
    }
    return true;
}

globalThis._getFile = function (path) {
    if (isTextFile(path)) {
        return fs.readFileSync(path);
    }
    return null;
};

function writeFile(filePath, file) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, file, () => {
            resolve();
        })
    })
}

function mkdir(dirPath) {
    return new Promise((resolve) => {
        fs.stat(dirPath, (e, state) => {
            if (!state) {
                mkdir(path.resolve(dirPath, '..')).then(() => {
                    fs.mkdir(dirPath, resolve);
                })
            } else {
                resolve();
            }
        })
    });
}

globalThis._saveDownloadFiles = function (dirName, files) {
    return new Promise(async (resolve, reject) => {
        const downloadPath = utools.getPath('downloads');
        const dirPath = path.join(downloadPath, dirName);
        await mkdir(dirPath)
        let task = [];
        files.forEach((file, fileName) => {
            const filePath = path.join(dirPath, fileName);
            task.push(writeFile(filePath, file))
        })
        Promise.all(task).then(() => {
            resolve(dirPath);
        })
    })
};

window.open = function (url) {
    if (url) {
        open(url);
    }
}
