<template>
  <span>
    <img v-if="menu.icon" class="context-menu__icon" :src="menu.icon">
    {{menu.label}}
  </span>
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
    }
  }
</script>
<style scoped>
  span {
    color: #333333;
  }
</style>
