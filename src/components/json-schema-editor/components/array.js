export class ArrayComponent {
  constructor (tooltip) {
    this.type = 'array'
    this.tooltip = tooltip
    this.icon = 'type'
    this.value = {
      type: 'array'
    }
    // missing patternProperties
    this.valueSchema = {
      type: 'object',
      properties: {
        additionalItems: {
          type: 'boolean'
        },
        minItems: {
          type: 'integer',
          minimum: 0
        },
        maxItems: {
          type: 'integer',
          minimum: 0
        },
        uniqueItems: {
          type: 'boolean'
        }
      }
    }
    this.children = []
    this.editable = false
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
          case 'ref':
          case 'items':
            return true
          default:
            return false
        }
      },
      acceptList (dest) {
        return (dest.children.length === 0)
          ? ['string', 'integer', 'number', 'boolean', 'object', 'array', 'null',
            'enum', 'allOf', 'anyOf', 'oneOf', 'not', 'ref', 'items'] : []
      },
      beforeAppend (dest, node) {
        // set name to 'items'
        if (node.type !== 'items') node.name = 'items'
      }
    }
  }
}

export default ArrayComponent
