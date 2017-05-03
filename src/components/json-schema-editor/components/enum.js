export class EnumComponent {
  constructor (tooltip) {
    this.type = 'enum'
    this.tooltip = tooltip
    this.icon = 'enum'
    this.value = {
      enum: []
    }
    this.valueSchema = {
      type: 'object',
      properties: {
        enum: {
          type: 'array'
        }
      },
      required: ['enum'],
      additionalProperties: false
    }
    this.editable = false
    this.funcs = {
      acceptList () {
        return []
      }
    }
  }
}

export default EnumComponent
