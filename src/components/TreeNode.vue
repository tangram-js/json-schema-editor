<template>
  <li class="tree__item" :id="node.id? node.id : null">
    <span
      v-if="node.children && node.expendable !== false"
      class="tree__toggle-btn"
      @click="toggle"
      v-html="toggleButton"
    ></span>
    <span v-else="node.children" class="tree__toggle-btn-indent">&nbsp;</span>
    <span
      class="tree__node"
      :class="{ 'tree__node__selected': node.selected }"
      :title="node.tooltip"
      :draggable="(node.draggable && !node.editing) ? 'true' : 'false'"
      @click="select"
      @dblclick="startEdit"
      @contextmenu="contextMenu"
      @dragstart="dragStart"
      @dragover="dragOver"
      @drop="drop"
    >
      <img v-if="icon" class="tree__node-icon" :src="icon" :draggable="(node.draggable && !node.editing) ? 'true' : 'false'">
      <span v-if="node.type">{{node.type}}</span>
      <span v-if="node.type" v-show="node.name">: </span>
      <input v-if="node.editing" type="text" v-model="name" @click="nameClicked" @change="changeName" @drop="disableDrop">
      <span v-else="node.editing" v-show="node.name" @click="nameClicked">{{node.name}}</span>
    </span>
    <transition name="fade">
      <ul class="tree__sub-tree" v-show="node.expended && node.children">
        <tree-node
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :options="options"
        >
        </tree-node>
      </ul>
    </transition>
  </li>
</template>
<script>
  export default {
    name: 'TreeNode',
    props: {
      node: {
        type: Object,
        required: true
      },
      options: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        name: ''
      }
    },
    computed: {
      icon () {
        if (this.options.iconModule) {
          let icon = this.options.iconModule.icon(this.node.icon)
          if (!icon) icon = this.options.iconModule.icon(this.node.type)
          if (!icon) {
            if (this.node.children) {
              icon = this.options.iconModule.icon('folder')
            } else {
              icon = this.options.iconModule.icon('file')
            }
          }
          return icon
        } else return null
      },
      toggleButton () {
        if (this.options.toggleButton) {
          return this.options.toggleButton(this.node.expended)
        } else return this.node.expended ? '&#9660;' : '&#9658;'
      }
    },
    methods: {
      toggle () {
        this.options.tree.toggle(this.node)
      },
      nameClicked (e) {
        if (this.node.selected && this.node.editable && this.options.editable) {
          this.name = this.node.name
          this.options.tree.startEdit(this.node)
          e.stopPropagation()
        }
      },
      select () {
        if (this.node.selected) {
          if (this.node.editing) this.options.tree.stopEdit(this.node)
          return
        }
        this.options.tree.select(this.node)
      },
      startEdit () {
        if ((!this.options.editable) || (!this.node.editable) || this.node.editing) return
        this.name = this.node.name
        this.options.tree.startEdit(this.node)
      },
      contextMenu (e) {
        this.select()
        this.options.tree.treeContextMenu(e, this)
        e.preventDefault()
        e.stopPropagation()
      },
      dragStart (e) {
        if (this.options.clipboard) {
          this.select()
          // put dragged component into clipboard
          this.options.clipboard.draggedObject = this
          e.dataTransfer.setData('text', this.node.id)
        }
      },
      dragOver (e) {
        if (!this.node.droppable || !this.node.children) return
        if (this.options.clipboard) {
          // check existence of dragged object from clipboard
          let draggedObject = this.options.clipboard.draggedObject
          if (!draggedObject) return
          // check for node drop on it's descendant or parent
          if (this.node === draggedObject.node.parent || this.node.isAncestor(draggedObject.node)) return
          // additional rule to validate drag over
          if (typeof this.options.dragOverRule === 'function') {
            if (!this.options.dragOverRule(this.node, draggedObject.node)) return
          }
          e.preventDefault()
        }
      },
      disableDrop (e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      drop (e) {
        e.preventDefault()
        if (this.options.clipboard) {
          let draggedObject = this.options.clipboard.draggedObject
          if (typeof draggedObject.remove === 'function') {
            draggedObject.remove()
          }
          this.append(draggedObject.node)
          draggedObject = null
        }
      },
      changeName () {
        this.options.tree.rename(this.node, this.name)
      },
      rename () {
        if (this.node.editable && this.options.editable) {
          this.name = this.node.name
          if (!this.node.editing) this.options.tree.startEdit(this.node)
        }
      },
      append (child) {
        this.options.tree.append(this.node, child)
      },
      remove () {
        let parent = this.node.parent
        this.options.tree.remove(this.node)
        this.options.tree.select(parent)
      },
      moveUp () {
        this.options.tree.moveUp(this.node)
      },
      moveDown () {
        this.options.tree.moveDown(this.node)
      }
    }
  }
</script>
<style scoped>
  ul.tree__sub-tree {
    padding-left: 1.5em;
    list-style-type: none;
    list-style-position: inside;
  }
  li.tree__item {
    margin-top: 2px;
    margin-bottom: 2px;
  }
  .tree__node {
    padding: 4px;
    cursor: default;
  }
  .tree__toggle-btn {
    cursor: pointer;
  }
  .tree__toggle-btn-indent {
    width: 1em;
    display: inline-block;
  }
  .tree__node:hover {
    background-color: #cff8ff;
  }
  .tree__node-icon {
    vertical-align: middle;
  }
  .tree__node__selected {
    background-color: lightskyblue;
  }
  .tree__node__selected:hover {
    background-color: lightskyblue;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
</style>
