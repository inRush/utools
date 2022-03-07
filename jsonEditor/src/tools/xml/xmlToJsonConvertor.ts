export default {
  convert: (ast: any) => {
    return buildJSONFromNode(ast.value.children[0])
  }
}

const buildJSONFromNode = (node: any) => {
  if (!node) return null
  const json: any = {}
  switch (node.type) {
    case 'ELEMENT': {
      let element: any = {}
      const attribs = buildAttributes(node.value.attributes)
      const children = buildJSONFromNode(node.value.children)
      if (attribs) {
        element = Object.assign(element, attribs)
      }
      if (children) {
        const jsonChildren = buildChildren(node.value.children)
        if (jsonChildren.content && Object.keys(element).length === 0) {
          element = jsonChildren.content;
        } else {
          element = Object.assign(element, jsonChildren)
        }
      }
      json[node.value.type] = element
      break
    }
    case 'ATTRIBUTE': {
      const attribNameAndValue = node.value
      json[`@${attribNameAndValue.name}`] = attribNameAndValue.value
      break
    }
    default: {
      break;
    }
  }

  return json
}

const buildChildren = (children: any) => {
  if (!children || !Array.isArray(children) || children.length === 0) return null
  if (isContentChildren(children)) {
    return {
      content: children[0].value
    }
  }
  return children.map(buildJSONFromNode)
      .reduce((agg, j) => Object.assign(agg, j), {})
}

const isContentChildren = (children: any) => children && Array.isArray(children) && children.length === 1 && children[0].type === 'CONTENT'

const buildAttributes = (arrayNodes: any) => {
  if (arrayNodes && Array.isArray(arrayNodes)) {
    const jsonArray = arrayNodes.map(buildJSONFromNode)
    return jsonArray.reduce((agg, j) => Object.assign(agg, j), {})
  }
  return null
}
