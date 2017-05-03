export class IntegerComponent {
  constructor (tooltip) {
    this.type = 'integer'
    this.tooltip = tooltip
    this.icon = 'type'
    this.value = {
      type: 'integer'
    }
    this.valueSchema = {
      type: 'object',
      properties: {
        multipleOf: {
          type: 'integer',
          minimum: 1
        },
        minimum: {
          type: 'integer'
        },
        excludeMinimum: {
          type: 'boolean'
        },
        maximum: {
          type: 'integer'
        },
        excludeMaximum: {
          type: 'boolean'
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

export default IntegerComponent
