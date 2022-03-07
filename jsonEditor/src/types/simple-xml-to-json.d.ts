declare module 'simple-xml-to-json' {
  function convertXML(xml: string, convertor?: any): string

  function createAST(xml: string): string
}
