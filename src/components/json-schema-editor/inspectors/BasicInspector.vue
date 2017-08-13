<template>
  <div class="inspector-form">
    <div v-for="prop in properties" :key="prop.name">
      <md-input-container v-if="prop.type !== 'boolean'">
        <label v-if="prop.type !== 'boolean'">{{prop.name}}</label>
        <md-input v-if="prop.type === 'integer' || prop.type === 'number'" style="font-size: 16px;" v-model="prop.value" :disabled="!prop.exist" @input="validate(prop)"></md-input>
        <md-input v-if="prop.type === 'string'" style="font-size: 16px;" v-model="prop.value" :disabled="!prop.exist"></md-input>
        <md-textarea v-if="prop.type === 'textarea'" style="font-size: 16px;" v-model="prop.value" :disabled="!prop.exist"></md-textarea>
        <md-checkbox class="md-primary inspector-checkbox" v-model="prop.exist"></md-checkbox>
      </md-input-container>
      <div v-if="prop.type === 'integer' || prop.type === 'number'" class="inspector-err-message">{{prop.errMsg}}</div>
      <md-switch v-if="prop.type === 'boolean'" class="md-primary" style="font-size: 16px" v-model="prop.value" :disabled="!prop.exist">{{prop.name}}</md-switch>
      <md-checkbox v-if="prop.type === 'boolean'" class="md-primary" style="float:right; margin: 14px 0;" v-model="prop.exist"></md-checkbox>
    </div>
    <md-button v-if="showButton" class="md-primary md-dense inspection-button" :disabled="updateDisabled" @click.native="update">UPDATE</md-button>
  </div>
</template>
<script>
  import Property from './Property'

  export default {
    props: {
      node: {
        type: Object
      }
    },
    data () {
      return {
        properties: []
      }
    },
    computed: {
      updateDisabled () {
        let disabled = false
        this.properties.forEach(prop => {
          if (prop.errMsg) disabled = true
        })
        return disabled
      },
      showButton () {
        return this.properties.length > 0
      }
    },
    methods: {
      set () {
        // populate properties
        this.properties = []
        if (!this.node.valueSchema) return
        if (!this.node.valueSchema.properties) return
        // retrieve property
        let props = this.node.valueSchema.properties
        Object.keys(props).forEach(p => {
          let prop = props[p]
          let type = prop.format ? prop.format : prop.type
          let property = new Property(type, p)
          if (prop.minimum) property.minimum = prop.minimum
          this.properties.push(property)
        })
        this.properties.forEach(prop => {
          prop.setValue(this.node.value[prop.name])
        })
      },
      validate (prop) {
        let valid = true
        let value
        if (prop.type === 'integer') {
          valid = !Number.isNaN(prop.value) && (function (x) { return (x | 0) === x })(Number.parseFloat(prop.value))
          value = Number.parseInt(prop.value)
          this.$set(prop, 'errMsg', valid ? null : 'Please input integer.')
        }
        if (prop.type === 'number') {
          valid = !Number.isNaN(Number.parseFloat(prop.value)) && Number.isFinite(Number.parseFloat(prop.value))
          value = Number.parseFloat(prop.value)
          prop.errMsg = valid ? null : 'Please input number.'
        }
        if (valid && prop.minimum) {
          prop.errMsg = value < prop.minimum ? `Please input value greater than ${prop.minimum}.` : null
        }
      },
      update () {
        this.properties.forEach(prop => {
          this.node.value[prop.name] = prop.getValue()
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
  .inspector-checkbox {
    margin: 6px 0 0 0;
  }
  .inspector-err-message {
    color: red;
    font-size: 10px;
  }
  .inspection-button {
    float: right;
  }
</style>
