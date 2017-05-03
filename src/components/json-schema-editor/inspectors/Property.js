export class Property {
  constructor (type, name) {
    this.type = type
    this.name = name
    this.value = null
    this.exist = false
    this.errMsg = null
  }

  setValue (value) {
    this.exist = typeof value !== 'undefined'
    this.value = value
    this.errMsg = null
  }

  getValue () {
    if (this.type === 'integer') {
      return this.exist ? Number.parseInt(this.value) : undefined
    }
    if (this.type === 'number') {
      return this.exist ? Number.parseFloat(this.value) : undefined
    }
    return this.exist ? this.value : undefined
  }
}

export default Property
