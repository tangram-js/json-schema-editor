export class StringComponent {
  constructor (tooltip) {
    this.type = 'string'
    this.tooltip = tooltip
    this.icon = 'type'
    this.value = {
      type: 'string'
    }
    this.valueSchema = {
      type: 'object',
      properties: {
        minLength: {
          type: 'integer',
          minimum: 0
        },
        maxLength: {
          type: 'integer',
          minimum: 0
        },
        pattern: {
          type: 'string'
        },
        format: {
          type: 'string'
        }
      }
    }
    this.children = []
    this.editable = false
    this.funcs = {
      accept (dest, node) {
        // only allow enum
        if (node.type === 'enum') {
          return true
        } else {
          return false
        }
      },
      acceptList () {
        return ['enum']
      }
      /*
      beforeAppend (dest, node) {
        if (node.type === 'enum') {
          // set enum's value schema
          node.valueSchema.properties.enum.items = dest.value
          node.valueSchema.properties.enum.additionalItems = false
        }
      }
      */
    }
  }
}

export default StringComponent
