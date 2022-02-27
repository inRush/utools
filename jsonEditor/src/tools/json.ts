// @ts-ignore
import prettier from "prettier/standalone";
// @ts-ignore
import parserJson5 from "prettier/parser-babel";

export const beautify = (code: string | undefined, {tab = 2} = {}) => {
  if (!code) {
    return code;
  }
  return prettier.format(code, {
    parser: "json5",
    plugins: [parserJson5],
    quoteProps: "preserve",
    trailingComma: "none",
    tabWidth: tab,
    printWidth: 1
  });
}
export const objectBeautify = (codeObject: object, option = {}) => {
  return beautify(JSON.stringify(codeObject), option)
}
// eslint-disable-next-line no-unused-vars
export const compress = (code: string | undefined) => {
  if (!code) {
    return code;
  }
  let result = [];
  for (let i = !1, o = 0, r = (code = code.split("\r\n").join(" ").split("\n").join(" ")).length; o < r; o++) {
    let a: any = code.charAt(o);
    i && a === i ?
        "\\" !== code.charAt(o - 1) && (i = !1) :
        i || '"' !== a && "'" !== a ? i || " " !== a && "\t" !== a || (a = "") : i = a;
    result.push(a);
  }
  return result.join("")
}

// 转义
export const escape = (content: string | undefined) => {
  return content?.trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

// 去转义
export const clearEscape = (content: string | undefined) => {
  return content?.trim().replace(/\\\\/g, '\\').replace(/\\"/g, '"')
}


const modes: any = {
  text: "text/plain",
  json: "application/json",
  js: "application/javascript",
  html: "text/html",
  xml: "application/xml",
  css: "text/css",
  less: "text/x-less",
  scss: "text/x-scss",
  graphql: "graphql",
  java: "text/x-java",
  ruby: "text/x-ruby",
  markdown: "text/x-markdown",
  php: "text/x-php",
  python: "text/x-python",
  sql: "text/x-sql",
  yaml: "text/x-yaml",
  ts: "application/typescript",
  csharp: "text/x-csharp",
  go: "text/x-go",
  dart: "application/dart",
  vue: "text/x-vue",
};

const modeConversion = (lang: string) => {
  return lang && (lang in modes) ? modes[lang] : 'text/plain'
}


export default {
  beautify, compress, objectBeautify
}
