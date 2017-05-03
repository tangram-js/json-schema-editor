<template>
  <div class="inspector-form">
    <div v-for="item in items" :key="item.name">
      <md-checkbox class="md-primary" style="font-size: 16px;" v-model="item.selected">{{item.name}}</md-checkbox>
    </div>
    <md-button class="md-primary md-dense inspection-button" @click.native="update">UPDATE</md-button>
  </div>
</template>
<script>
  export default {
    props: {
      node: {
        type: Object
      }
    },
    data () {
      return {
        items: []
      }
    },
    methods: {
      set () {
        this.items = []
        // find properties element
        let properties = this.node.parent.children.find(element => {
          return element.type === 'properties'
        })
        // get all properties
        let props = []
        properties.children.forEach(child => {
          props.push(child.name)
        })
        // populate items
        props.forEach(prop => {
          this.items.push({ name: prop, selected: this.node.value.indexOf(prop) >= 0 })
        })
      },
      update () {
        this.node.value.splice(0, this.node.value.length)
        this.items.forEach(item => {
          if (item.selected) this.node.value.push(item.name)
        })
        this.$parent.updated()
      }
    }
  }
</script>
<style scoped>
  .inspector-form {
    padding: 8px;
    width: 100%;
    height: 100%;
  }
  .inspection-button {
    float: right;
  }
</style>
