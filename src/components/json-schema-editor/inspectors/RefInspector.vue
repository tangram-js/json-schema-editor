<template>
  <div class="inspector-form">
    <md-input-container>
      <label>ref</label>
      <md-input style="font-size: 16px;" v-model="ref"></md-input>
    </md-input-container>
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
        ref: null
      }
    },
    methods: {
      set () {
        this.ref = this.node.value['$ref']
      },
      update () {
        this.node.value['$ref'] = this.ref
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
