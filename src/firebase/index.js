import * as firebase from 'firebase'

// Initialize firebase
// Replace following config with your Firebase config
var config = {
  apiKey: 'your firebase api key',
  authDomain: 'your firebase auth domain',
  databaseURL: 'your firebase database url',
  projectId: 'your firebase project id',
  storageBucket: 'your firebase storage bucket',
  messagingSenderId: 'your firebase message sender id'
}
firebase.initializeApp(config)

// define custom error for schema not exist
export function UserNotSignInError (message) {
  this.name = 'UserNotSignInError'
  this.message = message || 'No sign in user.'
  this.stack = (new Error()).stack
}
UserNotSignInError.prototype = Object.create(Error.prototype)
UserNotSignInError.prototype.constructor = UserNotSignInError

export class Authentication {
  constructor () {
    this.service = firebase.auth()
    this.currentUser = null
    this.callbacks = []
    this.service.onAuthStateChanged(user => {
      this.currentUser = user
      this.callbacks.forEach(callback => {
        callback(user)
      })
    })
    this.options = {
      requireVerifyEmail: false,
      sendVerifyEmailExplicitly: true,
      requireOldPassword: false
    }
  }

  addListener (callback) {
    this.callbacks.push(callback)
  }

  removeListener (callback) {
    let idx = this.callbacks.indexOf(callback)
    if (idx >= 0) this.callbacks.splice(idx, 1)
  }

  async signUp (email, password) {
    return new Promise((resolve, reject) => {
      this.service.createUserWithEmailAndPassword(email, password)
        .then(user => {
          resolve(user)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async sendVerificationEmail () {
    if (this.currentUser) {
      return new Promise((resolve, reject) => {
        this.currentUser.sendEmailVerification()
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    } else {
      throw new UserNotSignInError()
    }
  }

  async verifyEmail (code) {
    return new Promise((resolve, reject) => {
      this.service.applyActionCode(code)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async signIn (email, password) {
    return new Promise((resolve, reject) => {
      this.service.signInWithEmailAndPassword(email, password)
        .then(user => {
          resolve(user)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async changePassword (newPassword) {
    if (this.currentUser) {
      return new Promise((resolve, reject) => {
        this.currentUser.updatePassword(newPassword)
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    } else {
      throw new UserNotSignInError()
    }
  }

  async resetPassword (email) {
    return new Promise((resolve, reject) => {
      this.service.sendPasswordResetEmail(email)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async confirmPasswordReset (code, newPassword) {
    return new Promise((resolve, reject) => {
      this.service.confirmPasswordReset(code, newPassword)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async deleteUser () {
    if (this.currentUser) {
      return new Promise((resolve, reject) => {
        this.currentUser.delete()
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    } else {
      throw new UserNotSignInError()
    }
  }

  async signOut () {
    return new Promise((resolve, reject) => {
      this.service.signOut()
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async retrieveCurrentUser () {
    return new Promise((resolve, reject) => {
      this.currentUser = this.service.currentUser
      if (this.currentUser) {
        resolve(this.currentUser)
      } else {
        reject(new UserNotSignInError())
      }
    })
  }
}

export var authentication = new Authentication()

export class Storage {
  constructor () {
    this.service = firebase.storage()
  }
}

export class Database {
  constructor () {
    this.service = firebase.database()
  }

  async readSnapshot (reference) {
    return new Promise((resolve, reject) => {
      this.service.ref(reference).orderByKey().once('value')
        .then((snapshot) => {
          resolve(snapshot)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async readValue (reference) {
    return new Promise((resolve, reject) => {
      this.service.ref(reference).orderByKey().once('value')
        .then((snapshot) => {
          resolve(snapshot.val())
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async list (reference) {
    return new Promise((resolve, reject) => {
      this.service.ref(reference).orderByKey().once('value')
        .then((snapshot) => {
          let list = []
          snapshot.forEach(child => {
            list.push(child.key)
          })
          resolve(list)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async write (reference, data) {
    return new Promise((resolve, reject) => {
      this.service.ref(reference).set(data)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  async delete (reference) {
    return new Promise((resolve, reject) => {
      this.service.ref(reference).remove()
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
