import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/account/SignIn'
import SignUp from '@/components/account/SignUp.vue'
import VerifyEmail from '@/components/account/VerifyEmail.vue'
import ChangePassword from '@/components/account/ChangePassword'
import JsonSchemaEditor from '@/components/JsonSchemaEditor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: JsonSchemaEditor
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/verifyEmail',
      name: 'verifyEmail',
      component: VerifyEmail
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: ChangePassword
    }
  ]
})
