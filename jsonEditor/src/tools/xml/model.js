'use strict';

export const TOKEN_TYPE = {
    OPEN_BRACKET: "OPEN_BRACKET",
    ELEMENT_TYPE: "ELEMENT_TYPE",
    CLOSE_ELEMENT: "CLOSE_ELEMENT",
    ATTRIB_NAME: "ATTRIB_NAME",
    ATTRIB_VALUE: "ATTRIB_VALUE",
    ASSIGN: "ASSIGN",
    CLOSE_BRACKET: "CLOSE_BRACKET",
    CONTENT: "CONTENT",
    EOF: "EOF"
}

export const Token = (type, value) => ({
    type,
    value
})
