<template>
  <a>
    <img v-if="menu.icon" class="context-menu__icon" :src="menu.icon">
    <span v-show="menu.label">{{menu.label}}</span>
    <input type="text" v-model="value" @change="changed">
  </a>
</template>
<script>
  export default {
    created () {
      this.context.$on('retrieve-value', this.retrieveValue)
    },
    props: {
      menu: {
        type: Object,
        required: true
      },
      context: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        value: ''
      }
    },
    computed: {
      disabled () {
        if (typeof this.menu.disabled === 'function') return this.menu.disabled(this.context.source)
        return this.menu.disabled
      }
    },
    methods: {
      retrieveValue () {
        if (typeof this.menu.getValue === 'function') {
          this.value = this.menu.getValue(this.context.source)
        }
      },
      changed () {
        if (!this.disabled) {
          if (typeof this.menu.setValue === 'function') this.menu.setValue(this.context.source, this.value)
          this.context.menuSelected({ source: this.context.source, menu: this.menu, value: this.value })
          this.context.hide()
        }
      }
    }
  }
</script>
<style scoped>
  span {
    color: #333333;
  }
</style>
