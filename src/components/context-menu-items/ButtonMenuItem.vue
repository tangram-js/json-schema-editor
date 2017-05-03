<template>
  <a @click="select">
    <img v-if="menu.icon" class="context-menu__icon" :src="menu.icon">
    <span v-show="menu.label">{{menu.label}}</span>
  </a>
</template>
<script>
  export default {
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
    computed: {
      disabled () {
        if (typeof this.menu.disabled === 'function') return this.menu.disabled(this.context.source)
        return this.menu.disabled
      }
    },
    methods: {
      select () {
        if (!this.disabled) {
          if (typeof this.menu.action === 'function') {
            this.menu.action(this.context.source)
          }
          this.context.menuSelected({ source: this.context.source, menu: this.menu })
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
