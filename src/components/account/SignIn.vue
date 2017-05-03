<template>
  <div>
    <md-layout md-align="center">
      <md-card md-with-hover class="sign-in__form">
        <md-card-header>
          <div class="md-title">Sign In</div>
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
          </form>
          <div>
            <span class="sign-in__message">{{message}}</span>
          </div>
        </md-card-content>

        <md-card-actions>
          <md-button @click.native="forgotPassword">Forgot password</md-button>
          <md-button class="md-primary" @click.native="signIn">Sign In</md-button>
        </md-card-actions>
      </md-card>
    </md-layout>
  </div>
</template>
<script>
  import { authentication } from '../json-schema-editor'

  export default {
    name: 'SignIn',
    data () {
      return {
        email: '',
        password: '',
        message: null
      }
    },
    computed: {},
    methods: {
      async signIn () {
        this.message = ''
        try {
          await authentication.signIn(this.email, this.password)
          this.$root.$emit('accountStatus')
          this.$router.push('/')
        } catch (err) {
          this.message = err.message
        }
      },
      async forgotPassword () {
        this.message = ''
        try {
          await authentication.resetPassword(this.email)
          this.message = 'Request to reset the password has been sent, please check your email for reply.'
        } catch (err) {
          this.message = err.message
        }
      },
      signUp () {
        this.$router.push('/signUp')
      }
    },
    components: {}
  }
</script>
<style scoped>
  .sign-in__form {
    margin-top: 40px;
    width: 400px;
  }
  .sign-in__message {
    color: red;
  }
</style>
