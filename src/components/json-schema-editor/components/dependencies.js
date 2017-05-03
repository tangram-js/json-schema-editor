export class DependenciesComponent {
  constructor (tooltip) {
    this.type = 'dependencies'
    this.tooltip = tooltip
    this.icon = 'dependencies'
    this.value = undefined
    this.valueSchema = undefined
    this.children = []
    this.editable = false
    this.funcs = {
      accept (dest, node) {
        return (node.type === 'dependencyItem')
      },
      acceptList () {
        return ['dependencyItem']
      },
      beforeAppend (dest, node) {
        node.name = ''
      }
    }
  }
}

export default DependenciesComponent
