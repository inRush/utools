const fs = require('fs');
const open = require('open')
const quickType = require('quicktype-core')

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

globalThis._quickType = quickType
globalThis._convertJson = async function (targetLanguage, typeName, jsonString) {
    const jsonInput = quickType.jsonInputForTargetLanguage(targetLanguage);

    // We could add multiple samples for the same desired
    // type, or many sources for other types. Here we're
    // just making one type from one piece of sample JSON.
    await jsonInput.addSource({
        name: typeName,
        samples: [jsonString],
    });

    const inputData = new quickType.InputData();
    inputData.addInput(jsonInput);

    return await quickType.quicktype({
        inputData,
        lang: targetLanguage,
    });
}
