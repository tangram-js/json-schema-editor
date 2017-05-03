<template>
  <div>
    <md-layout md-align="center">
      <md-card md-with-hover class="confirm-email__form">
        <md-card-header>
          <div class="md-title">Verify User Email</div>
        </md-card-header>

        <md-card-content>
          <form novalidate @submit.stop.prevent="submit">
            <md-input-container>
              <label>Email</label>
              <md-input v-model="email" :disabled="email" placeholder="Please input email"></md-input>
            </md-input-container>
            <md-input-container>
              <label>Verification Code</label>
              <md-input v-model="confirmationCode" placeholder="Please input verification code"></md-input>
            </md-input-container>
          </form>
          <div>
            <span class="confirm-email__message">{{message}}</span>
          </div>
        </md-card-content>

        <md-card-actions>
          <md-button @click.native="resend">Resend Verification Code</md-button>
          <md-button class="md-primary" @click.native="confirm">Verify</md-button>
        </md-card-actions>
      </md-card>
    </md-layout>
  </div>
</template>
<script>
  import { authentication } from '../json-schema-editor'

  export default {
    name: 'ConfirmEmail',
    created () {
      if (this.$route.query.email) {
        this.email = this.$route.query.email
      }
    },
    data () {
      return {
        email: null,
        confirmationCode: '',
        message: null
      }
    },
    computed: {},
    methods: {
      async confirm () {
        try {
          await authentication.verifyEmail(this.confirmationCode)
          this.$router.push('/signIn')
        } catch (err) {
          this.message = err.message
        }
      },
      async resend () {
        try {
          await authentication.sendVerificationEmail(this.email)
          this.message = 'Verification code has sent. Please check the email and enter the verification code.'
        } catch (err) {
          this.message = err.message
        }
      }
    },
    components: {}
  }
</script>
<style scoped>
  .confirm-email__form {
    margin-top: 40px;
    width: 400px;
  }
  .confirm-email__message {
    white-space: pre-wrap;
    color: red;
  }
</style>
