<template>
  <div class="toolbox" :style="toolboxStyle">
    <toolbox-component
      v-for="component in componentList"
      :node="component"
      :options="options"
      :key="component.id"
    >
    </toolbox-component>
  </div>
</template>
<script>
  import ToolboxComponent from './ToolboxComponent.vue'

  function generateId () {
    return (new Date()).getTime() + ('000000000' + Math.floor((Math.random() * 10000) + 1)).substr(-4)
  }

  export default {
    created () {
      this.components.forEach(component => {
        component.id = generateId()
        this.componentList.push(component)
      })
      this.$on('selected', this.selected)
    },
    mounted () {
      if (this.$children.length > 0) {
        this.selectedComponent = this.$children[0]
        this.$children[0].selected()
      }
    },
    data () {
      return {
        componentList: [],
        selectedComponent: null
      }
    },
    computed: {
      toolboxStyle () {
        if (this.options.Orientation === 'horizontal') {
          return { 'flex-direction': 'row' }
        } else {
          return { 'flex-direction': 'column' }
        }
      }
    },
    props: {
      components: {
        type: Array,
        default: () => {
          return []
        }
      },
      options: {
        type: Object,
        required: true
      }
    },
    methods: {
      icon (node) {
        // use property as injected service
        if (this.options.iconModule) {
          let icon = this.options.iconModule.icon(node.icon)
          if (!icon) icon = this.options.iconModule.icon(node.type)
          if (!icon) {
            if (node.children) {
              icon = this.options.iconModule.icon('folder')
            } else {
              icon = this.options.iconModule.icon('file')
            }
          }
          return icon
        }
      },
      selected (source) {
        if (this.selectedComponent) this.selectedComponent.deselect()
        this.selectedComponent = source
        this.$emit('select', source)
      },
      append (node) {
        node.id = generateId()
        let index = this.componentList.findIndex(c => {
          return c.name === node.name
        })
        if (index >= 0) {
          // this.componentList[index] = node
          this.$set(this.componentList, index, node)
        } else {
          this.componentList.push(node)
        }
      },
      remove (node) {
        let index = this.componentList.indexOf(node)
        if (index >= 0) {
          this.componentList.splice(index, 1)
        }
      },
      retrieve (type, name) {
        let result = null
        this.componentList.forEach(component => {
          if (component.type === type) {
            if (name) {
              if (component.name === name) result = component
            } else {
              result = component
            }
          }
        })
        return result
      }
    },
    components: {
      ToolboxComponent
    }
  }
</script>
<style scoped>
  .toolbox {
    margin: 0;
    padding: 0;
    display: flex;
  }
</style>
