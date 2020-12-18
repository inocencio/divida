import axios from 'axios'

const instance = axios.create({
  baseURL: 'localhost:3000/v1'
})

export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$axios', { value: instance })
  }
}