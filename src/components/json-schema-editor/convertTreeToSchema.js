function clone (source) {
  return JSON.parse(JSON.stringify(source))
}

function convertTypeToSchema (node) {
  let schema = clone(node.value)
  if (node.children && node.children.length > 0) {
    schema.enum = clone(node.children[0].value)
  }
  return schema
}

function convertObjectToSchema (node) {
  let schema = clone(node.value)
  node.children.forEach(child => {
    switch (child.type) {
      case 'properties':
        schema.properties = convertPropertiesToSchema(child)
        break
      case 'required':
        schema.required = clone(child.value)
        break
      case 'dependencies':
        schema.dependencies = convertDependenciesToSchema(child)
        break
      case 'enum':
        schema.enum = clone(child.value.enum)
        break
    }
  })
  return schema
}

function convertArrayToSchema (node) {
  let schema = clone(node.value)
  if (node.children.length > 0) {
    let child = node.children[0]
    switch (child.type) {
      case 'jsonSchema':
        schema.items = convertTreeToSchema(child)
        break
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
      case 'null':
      case 'enum':
      case 'ref':
        schema.items = convertTypeToSchema(child)
        break
      case 'object':
        schema.items = convertObjectToSchema(child)
        break
      case 'array':
        schema.items = convertArrayToSchema(child)
        break
      case 'allOf':
      case 'anyOf':
      case 'oneOf':
      case 'not':
        schema.items = convertOptionToSchema(child)
        break
      case 'items':
        schema.items = convertItemsToSchema(child)
        break
    }
  }
  return schema
}

function convertPropertiesToSchema (node) {
  let schema = {}
  node.children.forEach(child => {
    switch (child.type) {
      case 'jsonSchema':
        schema[child.name] = convertTreeToSchema(child)
        break
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
      case 'null':
      case 'enum':
      case 'ref':
        schema[child.name] = convertTypeToSchema(child)
        break
      case 'object':
        schema[child.name] = convertObjectToSchema(child)
        break
      case 'array':
        schema[child.name] = convertArrayToSchema(child)
        break
      case 'allOf':
      case 'anyOf':
      case 'oneOf':
      case 'not':
        schema[child.name] = convertOptionToSchema(child)
        break
    }
  })
  return schema
}

function convertDependenciesToSchema (node) {
  let schema = {}
  node.children.forEach(child => {
    schema[child.name] = clone(child.value)
  })
  return schema
}

function convertItemsToSchema (node) {
  let schema = []
  node.children.forEach(child => {
    switch (child.type) {
      case 'jsonSchema':
        schema.push(convertTreeToSchema(child))
        break
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
      case 'null':
      case 'enum':
      case 'ref':
        schema.push(convertTypeToSchema(child))
        break
      case 'object':
        schema.push(convertObjectToSchema(child))
        break
      case 'array':
        schema.push(convertArrayToSchema(child))
        break
      case 'allOf':
      case 'anyOf':
      case 'oneOf':
      case 'not':
        schema.push(convertOptionToSchema(child))
        break
    }
  })
  return schema
}

function convertOptionToSchema (node) {
  let schema = {}
  schema[node.type] = []
  let list = schema[node.type]
  node.children.forEach(child => {
    switch (child.type) {
      case 'jsonSchema':
        list.push(convertTreeToSchema(child))
        break
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
      case 'null':
      case 'enum':
      case 'ref':
        list.push(convertTypeToSchema(child))
        break
      case 'object':
        list.push(convertObjectToSchema(child))
        break
      case 'array':
        list.push(convertArrayToSchema(child))
        break
      case 'allOf':
      case 'anyOf':
      case 'oneOf':
      case 'not':
        list.push(convertOptionToSchema(child))
        break
    }
  })
  return schema
}

function convertDefinitionsToSchema (node) {
  let schema = {}
  node.children.forEach(child => {
    switch (child.type) {
      case 'jsonSchema':
        schema[child.name] = convertTreeToSchema(child)
        break
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
      case 'null':
      case 'enum':
      case 'ref':
        schema[child.name] = convertTypeToSchema(child)
        break
      case 'object':
        schema[child.name] = convertObjectToSchema(child)
        break
      case 'array':
        schema[child.name] = convertArrayToSchema(child)
        break
      case 'allOf':
      case 'anyOf':
      case 'oneOf':
      case 'not':
        schema[child.name] = convertOptionToSchema(child)
        break
    }
  })
  return schema
}

export function convertTreeToSchema (tree) {
  let schema = {}
  let definitions
  tree.children.forEach(child => {
    switch (child.type) {
      case 'jsonSchema':
        schema = convertTreeToSchema(child)
        break
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
      case 'null':
      case 'enum':
        schema = convertTypeToSchema(child)
        break
      case 'object':
        schema = convertObjectToSchema(child)
        break
      case 'array':
        schema = convertArrayToSchema(child)
        break
      case 'allOf':
      case 'anyOf':
      case 'oneOf':
      case 'not':
        schema = convertOptionToSchema(child)
        break
      case 'definitions':
        definitions = convertDefinitionsToSchema(child)
        break
    }
  })
  if (!tree.parent) schema.title = tree.name
  if (tree.value.description) schema.description = tree.value.description
  if (definitions) schema.definitions = definitions
  return schema
}

export default convertTreeToSchema
