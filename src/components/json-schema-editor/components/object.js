// import convertTreeToSchema from '../convertTreeToSchema'

function typeExist (children, type) {
  let result = false
  children.forEach(child => {
    if (child.type === type) result = true
  })
  return result
}

export class ObjectComponent {
  constructor (tooltip) {
    this.type = 'object'
    this.tooltip = tooltip
    this.icon = 'type'
    this.value = {
      type: 'object'
    }
    // missing patternProperties
    this.valueSchema = {
      type: 'object',
      properties: {
        additionalProperties: {
          type: 'boolean'
        },
        minProperties: {
          type: 'integer',
          minimum: 0
        },
        maxProperties: {
          type: 'integer',
          minimum: 0
        }
      }
    }
    this.children = []
    this.editable = false
    this.funcs = {
      accept (dest, node) {
        // children can not have duplicate type
        if (typeExist(dest.children, node.type)) return false
        // required only allow when properties exist
        if (node.type === 'required') {
          return typeExist(dest.children, 'properties')
        }
        // dependencies only allow when properties exist
        if (node.type === 'dependencies') {
          return typeExist(dest.children, 'properties')
        }
        // list acceptable types
        switch (node.type) {
          case 'properties':
          case 'required':
          case 'dependencies':
          case 'enum':
            return true
          default:
            return false
        }
      },
      acceptList (dest) {
        let result = []
        if (!typeExist(dest.children, 'properties')) {
          result.push('properties')
        } else {
          if (!typeExist(dest.children, 'required')) result.push('required')
          if (!typeExist(dest.children, 'dependencies')) result.push('dependencies')
        }
        if (!typeExist(dest.children, 'enum')) result.push('enum')
        return result
      }
      /*
      beforeAppend (dest, node) {
        if (node.type === 'enum') {
          // set enum's value schema
          node.valueSchema.properties.enum.items = convertTreeToSchema({
            value: {},
            children: [dest]
          })
          node.valueSchema.properties.enum.additionalItems = false
        }
      }
      */
    }
  }
}

export default ObjectComponent
