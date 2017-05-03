<template>
  <ul class="tree__root">
    <tree-node
      v-if="root"
      ref="root"
      :node="root"
      :options="options"
    ></tree-node>
  </ul>
</template>
<script>
  import TreeNode from './TreeNode.vue'
  import TreeStore from './tree/store'

  export default {
    created () {
      this.options.tree = this
    },
    props: {
      options: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        tree: this,
        store: new TreeStore()
      }
    },
    computed: {
      root () {
        return this.store.tree
      }
    },
    methods: {
      init (tree) {
        this.store.init(tree)
        this.$emit('init', tree)
      },
      toggle (node) {
        this.store.toggle(node)
      },
      select (node) {
        this.store.select(node)
        this.$emit('select', node)
      },
      startEdit (node) {
        this.store.startEdit(node)
      },
      stopEdit (node) {
        this.store.stopEdit(node)
      },
      treeContextMenu (e, source) {
        this.$emit('context', e, source)
      },
      rename (node, name) {
        this.store.rename(node, name)
        this.$emit('rename', node, name)
      },
      append (node, child) {
        this.$emit('beforeappend', node, child)
        this.store.append(node, child)
        this.$emit('append', node, child)
      },
      remove (node) {
        this.store.remove(node)
        this.$emit('remove', node)
      },
      moveUp (node) {
        this.store.moveUp(node)
        this.$emit('moveup', node)
      },
      moveDown (node) {
        this.store.moveDown(node)
        this.$emit('movedown', node)
      }
    },
    components: {
      TreeNode
    }
  }
</script>
<style scoped>
  ul.tree__root {
    margin: 0;
    padding: 0;
    padding-left: 1.5em;
    list-style-type: none;
    list-style-position: inside;
  }
</style>
