import Vue from 'vue'
import App from '@/App.vue'
import VueCookie from 'vue-cookie'
import VueMask from 'v-mask'

import router from '@/router'
import axios from 'axios'

//our backend base URL
const apiURL = 'http://localhost:3000/v1'
localStorage.setItem('apiURL', apiURL)

//base backend API address with its version
const instance = axios.create({
  baseURL: apiURL
})


//monitoring routes.
instance.interceptors.request.use(
  config => {
    console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`)

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//set up a cookie handler to simulate a fake session
Vue.use(VueCookie)

//configura o v-mask
Vue.use(VueMask)


/**
 * Recieves a number in pennies format. Ex: 1099 and conver it to GBP format: £10.99
 * @param value - pennies or cents number without any kind of format
 * @returns {string} formatter
 */
Vue.filter('currencyFormatter', (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value / 100)
})

//helper functions to be used to every part of the app.
Vue.mixin({
  methods: {
    /**
     * Get the current logged user
     * @returns {boolean}
     */
    getUser: function() {
      const user = this.$cookie.get('login')

      return (user ? JSON.parse(user) : null)
    },
    /**
     * Check if the current user is an admin
     * @returns {boolean}
     */
    isAdminUser: function () {
      const user = this.$cookie.get('login')

      if (user) {
        return (JSON.parse(user).role === 'admin')
      }
    },
    /**
     * Remove the current user from 'session'. Products in session won't be removed.
     */
    logout: function() {
      this.$cookie.delete('login')
    },
    /**
     * SessionProducts handle all cart products by localStorage HTML5 function.
     * @param op - 'add' add a product or increase its amount. 'remove' to remove itself from the list or decrease it's amount.
     * 'removeall' to completely delete all items from the cart.
     * @param productId - stores the product's id
     * @returns {array} the products list with ID and amount
     */
    sessionProducts: function(op, productId) {
      let user = this.getUser()
      let profile = (user ? user.username : 'anonymous')
      let list = localStorage.getItem(profile)

      //is there a product list?
      if (!list)
        list = []
      else
        list = JSON.parse(list)

      if (op === 'add') {
        let idx = list.findIndex(e => e.id === productId)

        if (idx === -1)
          //first addiction
          list.push({ id: productId, amount: 1 })
        else {
          //update amounts
          list[idx].amount += 1
        }
      } else if (op === 'remove') {
        let idx = list.findIndex(e => e.id === productId)
        let product = list[idx]

        if (idx > -1 && product.amount > 1) {
          //decrease amounts
          product.amount -= 1
          list[idx] = product
        } else if (idx > -1 && product.amount <= 1) {
          //remove the product from the list
          list.splice(list.findIndex(e => e.id === productId), 1)
        }
      } else if (op === 'removeall') {
        localStorage.removeItem(profile)
      }
      
      //serialize and store it
      if (op !== 'removeall')
        localStorage.setItem(profile, JSON.stringify(list))

      return list
    }
  },
})

Vue.config.productionTip = false
//make it enabled globally, however you can still use importing directly axios from your components
//to change base URL
Vue.prototype.$axios = instance

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')