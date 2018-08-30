export default {
  jsonSchema: require('./json_schema24.png'),
  type: require('./type24.png'),
  object: require('./object24.png'),
  array: require('./array24.png'),
  properties: require('./properties24.png'),
  items: require('./items24.png'),
  enum: require('./enum24.png'),
  required: require('./required24.png'),
  options: require('./options24.png'),
  not: require('./not24.png'),
  ref: require('./ref24.png'),
  remark: require('./remark24.png'),
  dependencies: require('./dependencies24.png'),
  dependency: require('./dependency24.png'),
  definitions: require('./object24.png'),
  icon (name) {
    if (name) {
      if (this[name]) return this[name]
    }
    return null
  }
}
