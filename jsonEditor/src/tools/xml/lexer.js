'use strict'

import {Token, TOKEN_TYPE} from './model'

const EOF_TOKEN = Token('EOF')

const isCharBlank = char => char === " " || char === "\n" || char === "\r" || char === "\t"
const removeXMLDocumentHeader = (xmlAsString, pos) => {
    xmlAsString = xmlAsString.substr(pos)
    if (xmlAsString.startsWith('<?xml')) {
        xmlAsString = xmlAsString.replace(/<\?xml.*\?>/, '')
    }
    return xmlAsString;
}

const replaceQuotes = xmlAsString => xmlAsString.replace(/'/g, '"')

const normalizeXMLForLexer = xmlAsString => {
    let pos = 0
    while (pos < xmlAsString.length && isCharBlank(xmlAsString[pos])) pos++
    xmlAsString = removeXMLDocumentHeader(xmlAsString, pos)
    xmlAsString = replaceQuotes(xmlAsString)

    return xmlAsString
}

export function createLexer(xmlAsString) {

    xmlAsString = normalizeXMLForLexer(xmlAsString)

    let currentToken = null
    let pos = 0

    const peek = () => xmlAsString[pos]
    const hasNext = (targetPos) => currentToken !== EOF_TOKEN && (targetPos ? targetPos : pos) < xmlAsString.length
    const isBlankSpace = () => {
        const char = xmlAsString[pos]
        return isCharBlank(char)
    }

    const skipQuotes = () => {
        if (hasNext() && xmlAsString[pos] === '"') pos++
    }
    const skipSpaces = () => {
        while (hasNext() && isBlankSpace()) pos++
    }

    const readAlphaNumericCharsOrBrackets = (areSpecialCharsSupported) => {
        if (hasNext()) {
            if (xmlAsString[pos] === '<') {
                let buffer = '<'
                pos++
                if (hasNext() && xmlAsString[pos] === '/') {
                    pos++
                    buffer = '</'
                } else if (hasNext() &&
                    xmlAsString[pos] === '!' &&
                    xmlAsString[pos + 1] === '-' &&
                    xmlAsString[pos + 2] === '-') { // its a comment
                    pos++
                    pos++
                    pos++
                    buffer = '<!--'
                } else if (hasNext() && xmlAsString[pos] === '!' &&
                    hasNext(pos + 1) && xmlAsString[pos + 1] === '[' &&
                    hasNext(pos + 2) && xmlAsString[pos + 2] === 'C' &&
                    hasNext(pos + 3) && xmlAsString[pos + 3] === 'D' &&
                    hasNext(pos + 4) && xmlAsString[pos + 4] === 'A' &&
                    hasNext(pos + 5) && xmlAsString[pos + 5] === 'T' &&
                    hasNext(pos + 6) && xmlAsString[pos + 6] === 'A' &&
                    hasNext(pos + 7) && xmlAsString[pos + 7] === '[') {
                    pos += 8;
                    buffer = '<![CDATA['
                }
                return buffer
            } else if (xmlAsString[pos] === '=' || xmlAsString[pos] === '>') {
                const buffer = xmlAsString[pos]
                pos++
                return buffer
            }
        }
        return readAlphaNumericChars(!!areSpecialCharsSupported)
    }

    const readAlphaNumericChars = (areSpecialCharsSupported) => {
        const ELEMENT_TYPE_MATCHER = /[a-zA-Z0-9_:\-]/
        const NAMES_VALS_CONTENT_MATCHER = /[0-9_\s\.:\/\-\+\$~\|\^,\p{M}\p{P}\p{L}]/u
        const matcher = areSpecialCharsSupported ? NAMES_VALS_CONTENT_MATCHER : ELEMENT_TYPE_MATCHER
        let start = pos
        while (hasNext() && xmlAsString[pos].match(matcher)) pos++
        const buffer = xmlAsString.substring(start, pos)
        return buffer
    }

    const isElementBegin = () => currentToken && currentToken.type === TOKEN_TYPE.OPEN_BRACKET
    const isAssignToAttribute = () => currentToken && currentToken.type === TOKEN_TYPE.ASSIGN

    const next = () => {
        skipSpaces();
        if (!hasNext()) {
            currentToken = EOF_TOKEN
        } else if (isElementBegin()) { // starting new element
            skipSpaces()
            const buffer = readAlphaNumericCharsOrBrackets(false)
            currentToken = Token(TOKEN_TYPE.ELEMENT_TYPE, buffer)
        } else if (isAssignToAttribute()) { // assign value to attribute
            skipQuotes()
            let start = pos
            while (hasNext() && xmlAsString[pos] !== '"') pos++
            const buffer = xmlAsString.substring(start, pos)
            pos++
            currentToken = Token(TOKEN_TYPE.ATTRIB_VALUE, buffer)
        } else {
            skipSpaces()
            const buffer = readAlphaNumericCharsOrBrackets(true)
            switch (buffer) {
                case "=": {
                    if (currentToken.type === TOKEN_TYPE.ATTRIB_NAME) {
                        currentToken = Token(TOKEN_TYPE.ASSIGN)
                    } else {
                        currentToken = Token(TOKEN_TYPE.CONTENT, buffer)
                    }
                    break;
                }
                case "</": {
                    const start = pos
                    while (xmlAsString[pos] !== ">") pos++
                    currentToken = Token(TOKEN_TYPE.CLOSE_ELEMENT, xmlAsString.substring(start, pos))
                    pos++ // skip the ">"
                    break
                }
                case "<!--": {
                    // skipComment contents
                    const closingBuff = ['!', '-', '-']
                    while (hasNext() &&
                    (closingBuff[2] !== '>' ||
                        closingBuff[1] !== '-' ||
                        closingBuff[0] !== '-')) {
                        closingBuff.shift()
                        closingBuff.push(xmlAsString[pos])
                        pos++
                    }
                    return next()
                }
                case "<![CDATA[": {
                    const closingBuff = ['T', 'A', '['];
                    const start = pos;
                    while (hasNext() &&
                    (closingBuff[2] !== '>' ||
                        closingBuff[1] !== ']' ||
                        closingBuff[0] !== ']')) {
                        closingBuff.shift()
                        closingBuff.push(xmlAsString[pos])
                        pos++
                    }
                    currentToken = Token(TOKEN_TYPE.CONTENT, xmlAsString.substring(start, pos - 3))
                    break
                }
                case ">": {
                    currentToken = Token(TOKEN_TYPE.CLOSE_BRACKET)
                    break
                }
                case "<": {
                    currentToken = Token(TOKEN_TYPE.OPEN_BRACKET)
                    break
                }
                default: { // here we fall if we have alphanumeric string, which can be related to attributes, content or nothing
                    if (buffer && buffer.length > 0) {
                        if (currentToken.type === TOKEN_TYPE.CLOSE_BRACKET) {
                            let suffix = ''
                            if (peek() !== '<') {
                                suffix = readAlphaNumericChars(true)
                            }
                            currentToken = Token(TOKEN_TYPE.CONTENT, buffer + suffix)
                        } else if (currentToken.type !== TOKEN_TYPE.ATTRIB_NAME && currentToken.type !== TOKEN_TYPE.CONTENT) {
                            // it should be an attribute name token
                            currentToken = Token(TOKEN_TYPE.ATTRIB_NAME, buffer)
                        } else {
                            currentToken = Token(TOKEN_TYPE.CONTENT, buffer)
                        }
                        break;
                    } else {
                        const errMsg = 'Unknown Syntax : "' + xmlAsString[pos] + '"'
                        throw new Error(errMsg)
                    }
                }
            }
        }

        return currentToken
    }

    return {
        peek,
        next,
        hasNext
    }
}
