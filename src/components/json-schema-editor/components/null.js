export class NullComponent {
  constructor (tooltip) {
    this.type = 'null'
    this.tooltip = tooltip
    this.icon = 'type'
    this.value = {
      type: 'null'
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

export default NullComponent
