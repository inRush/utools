'use strict'

import jsonConverter from './converters/astToJson'
import {transpile} from './transpiler'

function convertXML(xmlAsString, customConverter) {
    return transpile(xmlAsString, customConverter || jsonConverter)
}

function createAST(xmlAsString) {
    return transpile(xmlAsString)
}

export default {
    convertXML,
    createAST
}
