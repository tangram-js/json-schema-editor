<template>
  <div class="toolbox-component">
    <div
          class="component-node"
          :class="{ 'component-node-selected' : isSelected }"
          :title="node.tooltip"
          draggable = "true"
          @click="selected"
          @dragstart="dragStart"
    >
      <img v-if="icon" class="component-node-icon" :src="icon">
      <span v-show="showTypeName">{{node.type}}</span>
      <span v-show="showTypeName && node.name">: </span>
      <span v-show="node.name">{{node.name}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isSelected: false
      }
    },
    computed: {
      icon () {
        return this.$parent.icon(this.node)
      },
      showTypeName () {
        return (typeof this.options.showTypeName === 'undefined') || this.options.showTypeName
      }
    },
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
    methods: {
      selected () {
        if (this.isSelected) return
        this.$parent.$emit('selected', this)
        this.isSelected = true
      },
      deselect () {
        this.isSelected = false
      },
      dragStart (e) {
        if (this.options.clipboard) {
          this.options.clipboard.draggedObject = null
          // fire event, let event handler put the dragged node into clipboard
          this.$parent.$emit('dragged', this.node)
          // if event handler has not do the job, then do it by own
          if (!this.options.clipboard.draggedObject) {
            // copy dragged node into clipboard
            let cloneNode
            cloneNode = {
              node: JSON.parse(JSON.stringify(this.node))
            }
            // remove attributes of tool component
            delete cloneNode.node.tooltip
            delete cloneNode.node.id
            this.options.clipboard.draggedObject = cloneNode
          }
          /*
          if (typeof this.options.cloneNode === 'function') {
            cloneNode = {
              node: this.options.cloneNode(this.node)
            }
          } else {
            cloneNode = {
              node: JSON.parse(JSON.stringify(this.node))
            }
            // remove attributes of tool component
            delete cloneNode.node.tooltip
            delete cloneNode.node.id
          }
          */
          e.dataTransfer.setData('text', 'clipboard')
        } else {
          e.preventDefault()
        }
      }
    }
  }
</script>
<style scoped>
  .toolbox-component {
    margin: 0px;
    display: inline-table;
  }
  .component-node {
    /*display: flex;*/
    padding: 4px 8px;
    cursor: default;
  }
  .component-node:hover {
    background-color: #cff8ff;
  }
  .component-node-icon {
    vertical-align: middle;
  }
  .component-node-selected {
    background-color: lightskyblue;
  }
  .component-node-selected:hover {
    background-color: lightskyblue;
  }
</style>
