export class BooleanComponent {
  constructor (tooltip) {
    this.type = 'boolean'
    this.tooltip = tooltip
    this.icon = 'type'
    this.value = {
      type: 'boolean'
    }
    this.valueSchema = {
      type: 'object'
    }
    this.editable = false
    this.funcs = {
      acceptList () {
        return []
      }
    }
  }
}

export default BooleanComponent
