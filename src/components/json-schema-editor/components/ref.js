export class RefComponent {
  constructor (tooltip) {
    this.type = 'ref'
    this.tooltip = tooltip
    this.icon = 'ref'
    this.value = {
      '$ref': ''
    }
    this.valueSchema = {
      type: 'object',
      properties: {
        '$ref': {
          type: 'string'
        }
      },
      required: ['$ref'],
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

export default RefComponent
