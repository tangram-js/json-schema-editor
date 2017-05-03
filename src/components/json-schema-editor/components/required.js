export class RequiredComponent {
  constructor (tooltip) {
    this.type = 'required'
    this.tooltip = tooltip
    this.icon = 'required'
    this.value = []
    this.valueSchema = {
      type: 'array',
      items: {
        type: 'string',
        enum: []
      }
    }
    this.editable = false
    this.funcs = {
      acceptList () {
        return []
      }
    }
  }
}

export default RequiredComponent
