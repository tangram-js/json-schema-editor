<template>
  <a>
    <img v-if="menu.icon" class="context-menu__icon" :src="menu.icon">
    <span v-show="menu.label">{{menu.label}}</span>
    <select v-model="value" @change="changed">
      <option v-for="item in items" :value="item.value">{{item.label}}</option>
    </select>
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
      },
      items () {
        if (typeof this.menu.selectItems === 'function') {
          return this.menu.selectItems(this.context.source)
        }
        if (Array.isArray(this.menu.selectItems)) {
          return this.menu.selectItems
        }
        return [{ value: '', label: '' }]
      }
    },
    methods: {
      retrieveValue () {
        if (typeof this.menu.getValue === 'function') {
          this.value = this.menu.getValue(this.context.source)
        }
        // if value not in the select item, then set it to empty string
        let matchResult = this.items.find(item => {
          return item.value === this.value
        })
        if (typeof matchResult === 'undefined') this.value = ''
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
