const fs = require('fs');
const open = require('open')

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

window.open = function (url) {
    if (url) {
        open(url);
    }
}
