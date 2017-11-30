import * as firebase from 'firebase'
import { Database, UserNotSignInError } from '../../firebase'
import $RefParser from 'json-schema-ref-parser'

// define custom error for repository has not initialized
export function RepositoryNotInitError (message) {
  this.name = 'RepositoryNotInitError'
  this.message = message || 'Repository has not initialized.'
  this.stack = (new Error()).stack
}
RepositoryNotInitError.prototype = Object.create(Error.prototype)
RepositoryNotInitError.prototype.constructor = RepositoryNotInitError

// define custom error for schema not exist
export function SchemaNotExistError (message) {
  this.name = 'SchemaNotExistError'
  this.message = message || 'Schema not exist.'
  this.stack = (new Error()).stack
}
SchemaNotExistError.prototype = Object.create(Error.prototype)
SchemaNotExistError.prototype.constructor = SchemaNotExistError

// encode key to URL Encoded string
function EncodeSchema (schema) {
  var result = {}
  for (var prop in schema) {
    var value = schema[prop]
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[encodeURIComponent(prop)] = EncodeSchema(value)
    } else {
      result[encodeURIComponent(prop)] = value
    }
  }
  return result
}

// decode key from URL Encoded string
function DecodeSchema (schema) {
  var result = {}
  for (var prop in schema) {
    var value = schema[prop]
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[decodeURIComponent(prop)] = DecodeSchema(value)
    } else {
      result[decodeURIComponent(prop)] = value
    }
  }
  return result
}

export class Repository {
  constructor () {
    this.database = new Database()
    this.uid = null
    // firebase resolver for json-schema-ref-parser
    this.firebaseResolver = {
      order: 1,
      canRead: /^repository:/i,
      read: async (file) => {
        let schemaName = file.url.substr(13)
        return await this.retrieveSchema(schemaName, false)
      }
    }
  }

  async init () {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.uid = firebase.auth().currentUser.uid
        resolve()
      } else {
        reject(new UserNotSignInError())
      }
    })
  }

  async retrieveSchema (schemaName, dereference) {
    if (!this.uid) throw new RepositoryNotInitError()
    let reference = `/schemas/${this.uid}/${schemaName}`
    let schema = await this.database.readValue(reference)
    if (schema) {
      schema = DecodeSchema(schema)
      if (dereference || typeof dereference === 'undefined') {
        try {
          return await $RefParser.dereference(schema, { resolve: { firebase: this.firebaseResolver } })
        } catch (err) {
          // return un-dereference schema
        }
      }
      return schema
    } else {
      throw new SchemaNotExistError()
    }
  }

  async retrieveAllSchemas () {
    if (!this.uid) throw new RepositoryNotInitError()
    let reference = `/schemas/${this.uid}`
    let queryResult = await this.database.readSnapshot(reference)
    let schemas = []
    queryResult.forEach(item => {
      schemas.push(DecodeSchema(item.val()))
    })
    return schemas
  }

  async retrieveTypes () {
    if (!this.uid) throw new RepositoryNotInitError()
    let reference = `/schemas/${this.uid}`
    let types = await this.database.list(reference)
    return types
  }

  async saveSchema (schema, schemaName) {
    if (!this.uid) throw new RepositoryNotInitError()
    let reference = `/schemas/${this.uid}/${schemaName}`
    await this.database.write(reference, EncodeSchema(schema))
  }

  async deleteSchema (schemaName) {
    if (!this.uid) throw new RepositoryNotInitError()
    let reference = `/schemas/${this.uid}/${schemaName}`
    await this.database.delete(reference)
  }

  async deleteAllSchemas () {
    if (!this.uid) throw new RepositoryNotInitError()
    let reference = `/schemas/${this.uid}`
    await this.database.delete(reference)
  }
}

export var repository = new Repository()

export default repository

