<template>
  <div>
    <md-layout md-align="center">
      <md-card md-with-hover class="sign-up__form">
        <md-card-header>
          <div class="md-title">Sign Up</div>
        </md-card-header>

        <md-card-content>
          <form novalidate @submit.stop.prevent="submit">
            <md-input-container>
              <label>Email</label>
              <md-input v-model="email" placeholder="Please input email"></md-input>
            </md-input-container>
            <md-input-container md-has-password>
              <label>Password</label>
              <md-input type="password" v-model="password" placeholder="Please input password"></md-input>
            </md-input-container>
            <md-input-container md-has-password>
              <label>Confirm Password</label>
              <md-input type="password" @input="validatePassword" v-model="confirmPassword" placeholder="Please input password again"></md-input>
            </md-input-container>
          </form>
          <div>
            <span class="sign-up__message">{{message}}</span>
          </div>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-primary" @click.native="signUp">Sign Up</md-button>
        </md-card-actions>
      </md-card>
    </md-layout>
  </div>
</template>
<script>
  import { authentication } from '../json-schema-editor'

  export default {
    name: 'SignUp',
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        message: null
      }
    },
    computed: {},
    methods: {
      validatePassword () {
        if (this.password === this.confirmPassword) {
          this.message = ''
        } else {
          this.message = 'password not match with confirm password!'
        }
      },
      async signUp () {
        try {
          if (this.password !== this.confirmPassword) {
            this.message = 'password not match with confirm password!'
            return
          } else {
            this.message = ''
          }
          await authentication.signUp(this.email, this.password)
          if (authentication.options.requireVerifyEmail) {
            if (authentication.options.sendVerifyEmailExplicitly) await authentication.sendVerificationEmail()
            this.$router.push(`/verifyEmail?email=${this.email}`)
          }
          if (authentication.currentUser !== null) {
            this.$router.push('/')
          } else {
            this.$router.push('/signIn')
          }
        } catch (err) {
          this.message = err.message
        }
      }
    },
    components: {}
  }
</script>
<style scoped>
  .sign-up__form {
    margin-top: 40px;
    width: 400px;
  }
  .sign-up__message {
    white-space: pre-wrap;
    color: red;
  }
</style>
