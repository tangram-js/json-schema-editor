export class DependencyItemComponent {
  constructor (tooltip) {
    this.type = 'dependencyItem'
    this.tooltip = tooltip
    this.icon = 'dependency'
    this.value = []
    this.valueSchema = {
      type: 'array',
      items: {
        type: 'string',
        enum: []
      },
      additionalItems: false,
      uniqueItems: true
    }
    this.editable = false
    this.funcs = {
      acceptList () {
        return []
      }
    }
  }
}

export default DependencyItemComponent
