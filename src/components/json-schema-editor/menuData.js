export var menuData = {
  menuItems: [
    {
      name: 'remove',
      label: 'Remove',
      disabled (source) {
        return !(source.node.parent)
      },
      action (source) {
        source.remove()
      }
    },
    {
      name: 'moveUp',
      label: 'Move Up',
      disabled (source) {
        return !(source.node.parent)
      },
      action: source => {
        source.moveUp()
      }
    },
    {
      name: 'moveDown',
      label: 'Move Down',
      disabled (source) {
        return !(source.node.parent)
      },
      action: source => {
        source.moveDown()
      }
    }
  ]
}

export default menuData
