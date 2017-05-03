export class JsonSchemaComponent {
  constructor (tooltip) {
    this.type = 'jsonSchema'
    this.name = 'schema'
    this.tooltip = tooltip
    this.icon = 'jsonSchema'
    this.value = {}
    this.valueSchema = {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          format: 'textarea'
        }
      }
    }
    this.children = []
    this.editable = true
    this.funcs = {
      accept (dest, node) {
        // could only has one child
        if (dest.children.length > 0) return false
        // list acceptable types
        switch (node.type) {
          case 'jsonSchema':
          case 'string':
          case 'integer':
          case 'number':
          case 'boolean':
          case 'object':
          case 'array':
          case 'null':
          case 'enum':
          case 'allOf':
          case 'anyOf':
          case 'oneOf':
          case 'not':
            return true
          default:
            return false
        }
      },
      acceptList (dest) {
        return (dest.children.length === 0)
          ? ['string', 'integer', 'number', 'boolean', 'object', 'array', 'null',
            'enum', 'allOf', 'anyOf', 'oneOf', 'not', 'ref'] : []
      },
      dropped (dest, node) {
        // dest.expended = true
      }
    }
  }
}

export default JsonSchemaComponent
