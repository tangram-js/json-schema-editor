import Vue from 'vue'

function generateId () {
  return (new Date()).getTime() + ('000000000' + Math.floor((Math.random() * 10000) + 1)).substr(-4)
}

function resolveDupName (node, parent) {
  var origName = node.name
  var count = 0
  parent.children.forEach(child => {
    let reg = new RegExp(`^${RegExp.escape(origName)}(\\(\\d+\\))?$`, 'g')
    if (reg.test(child.name)) count++
  })
  if (count > 0) {
    node.name = `${origName}(${count})`
  }
}

function functionName (func) {
  // Match:
  // - ^          the beginning of the string
  // - function   the word 'function'
  // - \s+        at least some white space
  // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
  // - \s*        optionally followed by white space (in theory there won't be any here,
  //              so if performance is an issue this can be omitted[1]
  // - \(         followed by an opening brace
  //
  let result = /^function\s+([\w$]+)\s*\(/.exec(func.toString())

  return result ? result[1] : '' // for an anonymous function there won't be a match
}

var selectedNode

function populateTree (node, parent) {
  let root = new TreeNode(node.type, node.name, node.value, node.valueSchema,
    parent, node.icon, node.funcs, node.editable, node.draggable, node.droppable,
    node.expended, node.selected)
  if (root.selected) selectedNode = root
  if (node.children) {
    root.children = []
    node.children.forEach(child => {
      root.children.push(populateTree(child, root))
    })
  }
  return root
}

class TreeNode {
  constructor (type, name, value, valueSchema, parent, icon, funcs, editable, draggable, droppable, expended, selected) {
    this.id = generateId()
    this.type = type
    this.name = name
    this.valueSchema = valueSchema || { type: 'object' }
    // consider use default of schema when value is null
    this.value = value
    this.parent = parent
    this.icon = icon
    this.funcs = funcs
    this.editable = typeof editable === 'undefined' ? true : editable
    this.draggable = typeof draggable === 'undefined' ? true : draggable
    this.droppable = typeof droppable === 'undefined' ? true : droppable
    this.expended = expended
    this.selected = selected
    this.editing = false
  }

  isAncestor (node) {
    if (this === node) return true
    if (this.parent) return this.parent.isAncestor(node)
    else return false
  }

  append (child) {
    // if child is not TreeNode, then create TreeNode
    let newNode = (child.prototype && functionName(child.prototype) === 'TreeNode') ? child : populateTree(child)
    if (newNode.name) resolveDupName(newNode, this)
    Vue.set(newNode, 'parent', this)
    this.children.push(newNode)
    Vue.set(this, 'expended', true)
  }

  remove () {
    if (this.parent) {
      let children = this.parent.children
      let index = children.indexOf(this)
      children.splice(index, 1)
      Vue.set(this, 'parent', null)
    }
  }

  moveUp () {
    if (this.parent) {
      let children = this.parent.children
      let index = children.indexOf(this)
      if (index <= 0) return
      children.splice(index, 1)
      children.splice(index - 1, 0, this)
    }
  }

  moveDown () {
    if (this.parent) {
      let children = this.parent.children
      let index = children.indexOf(this)
      if (index === -1 || index === children.length - 1) return
      children.splice(index, 1)
      children.splice(index + 1, 0, this)
    }
  }
}

class Store {
  constructor () {
    this.tree = null
    this.selectedNode = null
  }

  init (tree) {
    selectedNode = null
    this.tree = populateTree(tree)
    if (selectedNode) {
      this.selectedNode = selectedNode
    } else {
      this.tree.selected = true
      this.selectedNode = this.tree
    }
  }

  toggle (node) {
    node.expended = !node.expended
  }

  select (node) {
    if (this.selectedNode) {
      this.selectedNode.selected = false
      this.selectedNode.editing = false
    }
    this.selectedNode = node
    node.selected = true
  }

  startEdit (node) {
    node.editing = true
  }

  stopEdit (node) {
    node.editing = false
  }

  rename (node, name) {
    node.name = name
    node.editing = false
  }

  append (node, child) {
    node.append(child)
  }

  remove (node) {
    node.remove()
  }

  moveUp (node) {
    node.moveUp()
  }

  moveDown (node) {
    node.moveDown()
  }
}

export default Store
