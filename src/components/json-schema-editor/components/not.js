export class NotComponent {
  constructor (tooltip) {
    this.type = 'not'
    this.tooltip = tooltip
    this.icon = 'not'
    this.value = undefined
    this.valueSchema = undefined
    this.editable = false
    this.children = []
    this.funcs = {
      accept (dest, node) {
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
            return true
          default:
            return false
        }
      },
      acceptList () {
        return ['string', 'integer', 'number', 'boolean', 'object', 'array', 'null',
          'enum', 'allOf', 'anyOf', 'oneOf', 'not', 'ref']
      }
    }
  }
}

export default NotComponent
