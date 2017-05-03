<template>
  <component ref="inspector" :is="inspector" :node="node"></component>
</template>
<script>
  import inspectors from './inspectors'

  export default {
    data () {
      return {
        inspector: 'BasicInspector',
        node: null
      }
    },
    methods: {
      set (node) {
        let inspector = node.type ? node.type : 'BasicInspector'
        let inspectorComponent = `${inspector}Inspector`
        this.inspector = inspectors[inspectorComponent] ? inspectorComponent : 'BasicInspector'
        this.node = node
        // invoke inspector to set value
        this.$nextTick(() => {
          this.$refs.inspector.set()
        })
      },
      updated () {
        this.$emit('updated')
      }
    },
    components: inspectors
  }
</script>
<style>
</style>
