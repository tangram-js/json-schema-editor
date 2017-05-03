<template>
  <div>
    <md-layout md-align="center">
      <md-card md-with-hover class="change-password__form">
        <md-card-header>
          <div class="md-title">Change Password</div>
        </md-card-header>

        <md-card-content>
          <form novalidate @submit.stop.prevent="submit">
            <md-input-container md-has-password v-if="requireOldPassword">
              <label>Old Password</label>
              <md-input type="password" v-model="oldPassword" placeholder="Please input old password"></md-input>
            </md-input-container>
            <md-input-container md-has-password>
              <label>New Password</label>
              <md-input type="password" v-model="password" placeholder="Please input new password"></md-input>
            </md-input-container>
            <md-input-container md-has-password>
              <label>Confirm New Password</label>
              <md-input type="password" @input="validatePassword" v-model="confirmPassword" placeholder="Please input new password again"></md-input>
            </md-input-container>
          </form>
          <div>
            <span class="change-password__message">{{message}}</span>
          </div>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-primary" @click.native="changePassword">Change Password</md-button>
        </md-card-actions>
      </md-card>
    </md-layout>
  </div>
</template>
<script>
  import { authentication } from '../json-schema-editor'

  export default {
    name: 'ChangePassword',
    data () {
      return {
        requireOldPassword: authentication.options.requireOldPassword,
        oldPassword: '',
        password: '',
        confirmPassword: '',
        message: null
      }
    },
    methods: {
      validatePassword () {
        if (this.password === this.confirmPassword) {
          this.message = ''
        } else {
          this.message = 'password not match with confirm password!'
        }
      },
      async changePassword () {
        try {
          if (this.password !== this.confirmPassword) {
            this.message = 'password not match with confirm password!'
            return
          } else {
            this.message = ''
          }
          await authentication.changePassword(this.password, this.oldPassword)
          this.message = 'Password has been changed.'
        } catch (err) {
          this.message = err.message
        }
      }
    }
  }
</script>
<style scoped>
  .change-password__form {
    margin-top: 40px;
    width: 400px;
  }
  .change-password__message {
    white-space: pre-wrap;
    color: red;
  }
</style>
