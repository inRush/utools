declare module '@/tools/xml/xmlToJson' {
  function convertXML(xml: string, convertor?: any): string

  function createAST(xml: string): string
}
