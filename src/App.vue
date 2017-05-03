<template>
  <div id="app">
    <md-toolbar class="md-dense">
      <h3 class="md-title title" @click="home">Json Schema Editor</h3>
      <span style="flex: 1;">&nbsp;</span>
      <md-button @click.native="signIn" v-if="!isSignIn">Sign In</md-button>
      <md-button @click.native="signUp" v-if="!isSignIn">Sign Up</md-button>

      <md-menu v-if="isSignIn" md-align-trigger>
        <md-button md-menu-trigger>My Account</md-button>
        <md-menu-content>
          <md-menu-item @click.native="signOut">Sign Out</md-menu-item>
          <md-menu-item @click.native="changePassword">Change Password</md-menu-item>
          <md-menu-item @click.native="deleteAccount">Delete Account</md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-toolbar>
    <div class="view-container">
      <router-view></router-view>
    </div>
    <md-dialog ref="deleteAccountDialog">
      <md-dialog-title>Delete Account</md-dialog-title>
      <md-dialog-content>
        Are you sure to delete your account?<br>
        All your stored schemas would be lost!
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click.native="deleteAccountCanceled">Cancel</md-button>
        <md-button class="md-primary" @click.native="deleteAccountConfirmed">Confirm</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import { authentication, repository } from './components/json-schema-editor'

  export default {
    name: 'app',
    async created () {
      try {
        await authentication.retrieveCurrentUser()
      } catch (err) {}
      this.isSignIn = authentication.currentUser !== null
      authentication.addListener(this.authChanged)
      this.$root.$on('accountStatus', () => {
        this.isSignIn = authentication.currentUser !== null
      })
    },
    computed: {
      path () {
        return this.$route.path
      }
    },
    data () {
      return {
        isSignIn: false,
        active: 'active'
      }
    },
    methods: {
      authChanged (user) {
        this.isSignIn = user !== null
      },
      home () {
        this.$router.push('/')
      },
      signIn () {
        this.$router.push('/signIn')
      },
      signUp () {
        this.$router.push('/signUp')
      },
      changePassword () {
        this.$router.push('/changePassword')
      },
      async signOut () {
        try {
          await authentication.signOut()
        } catch (err) {}
        this.$nextTick(() => {
          console.log('reload')
          window.location.reload()
        })
      },
      deleteAccount () {
        this.$refs.deleteAccountDialog.open()
      },
      deleteAccountCanceled () {
        this.$refs.deleteAccountDialog.close()
      },
      async deleteAccountConfirmed () {
        // delete account and remove all custom schemas
        try {
          await repository.deleteAllSchemas()
          await authentication.deleteUser()
        } catch (err) {}
        this.$refs.deleteAccountDialog.close()
        this.$nextTick(() => {
          window.location.reload()
        })
      }
    }
  }
</script>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .title {
    cursor: pointer;
  }
  .view-container {
    flex: 1;
    overflow-y: auto;
  }
</style>
