export class DefinitionsComponent {
  constructor (tooltip) {
    this.type = 'definitions'
    this.tooltip = tooltip
    this.icon = 'definitions'
    this.value = undefined
    this.valueSchema = undefined
    this.children = []
    this.editable = false
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
      },
      beforeAppend (dest, node) {
        node.name = 'definition'
        node.editable = true
      }
    }
  }
}

export default DefinitionsComponent
