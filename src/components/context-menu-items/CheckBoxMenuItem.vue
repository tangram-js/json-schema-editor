<template>
  <a @click="click">
    <input type="checkbox" v-model="value">
    <img v-if="menu.icon" class="context-menu__icon" :src="menu.icon">
    <span v-show="menu.label">{{menu.label}}</span>
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
        value: false
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
        if (typeof this.menu.getValue === 'function') this.value = this.menu.getValue(this.context.source)
      },
      click () {
        if (!this.disabled) {
          this.checked = !this.checked
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
