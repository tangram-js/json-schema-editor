export class NumberComponent {
  constructor (tooltip) {
    this.type = 'number'
    this.tooltip = tooltip
    this.icon = 'type'
    this.value = {
      type: 'number'
    }
    this.valueSchema = {
      type: 'object',
      properties: {
        multipleOf: {
          type: 'number',
          minimum: 0,
          excludeMinimum: true
        },
        minimum: {
          type: 'number'
        },
        excludeMinimum: {
          type: 'boolean'
        },
        maximum: {
          type: 'number'
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

export default NumberComponent
