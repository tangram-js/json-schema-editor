<template>
  <div class="inspector-form">
    <div class="inspector-label">enum items</div>
    <div class="inspector-list">
      <div v-for="item in items" :key="item.name">
        <md-checkbox class="md-primary" style="margin: 0;" v-model="item.selected"></md-checkbox>
        <span class="inspector-json">{{item.json}}</span>
      </div>
    </div>
    <md-input-container>
      <label>json of value</label>
      <md-textarea style="font-size: 12px;" v-model="json"></md-textarea>
    </md-input-container>
    <div class="inspector-error">{{errorMessage}}</div>
    <div>
      <md-button class="md-primary md-dense inspection-button" @click.native="update">UPDATE</md-button>
      <md-button class="md-dense inspection-button" @click.native="add">Add</md-button>
    </div>
  </div>
</template>
<script>
  import Ajv from 'ajv'
  import convertTreeToSchema from '../convertTreeToSchema'

  export default {
    props: {
      node: {
        type: Object
      }
    },
    data () {
      return {
        items: [],
        itemSchema: null,
        json: '',
        errorMessage: ''
      }
    },
    methods: {
      set () {
        // if parent node is valid type, then get parent's schema
        let type = this.node.parent.type
        this.itemSchema = (type === 'string' || type === 'integer' || type === 'number' || type === 'object')
          ? convertTreeToSchema({
            value: {},
            children: [this.node.parent]
          }) : null
        // remove enum from schema
        if (this.itemSchema) delete this.itemSchema.enum
        // populate items
        this.items = []
        this.node.value.enum.forEach(item => {
          this.items.push({ json: JSON.stringify(item), selected: true })
        })
      },
      add () {
        this.errorMessage = ''
        let value
        // convert json
        try {
          value = JSON.parse(this.json)
        } catch (e) {
          this.errorMessage = e.message
          return
        }
        // if schema exist then validate with schema
        if (this.itemSchema) {
          let ajv = new Ajv()
          let validate = ajv.compile(this.itemSchema)
          if (!validate(value)) {
            validate.errors.forEach(error => {
              this.errorMessage = this.errorMessage + error.message + '\r\n'
            })
            return
          }
        }
        // add value to items
        this.items.push({ json: JSON.stringify(value), selected: true })
        this.errorMessage = ''
        this.json = null
      },
      update () {
        this.node.value.enum.splice(0, this.node.value.enum.length)
        this.items.forEach(item => {
          if (item.selected) this.node.value.enum.push(JSON.parse(item.json))
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
    display: flex;
    flex-direction: column;
  }
  .inspector-label {
    color: rgba(0,0,0,.54);
    font-size: 16px;
    margin-bottom: 4px;
  }
  .inspector-list {
    padding-top: 6px;
    padding-bottom: 6px;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    overflow-y: auto;
    flex: 1;
  }
  .inspector-json {
    font-size: 12px;
  }
  .inspector-error {
    font-size: 12px;
    color: red;
    white-space: pre-wrap;
  }
  .inspection-button {
    float: right;
  }
</style>
