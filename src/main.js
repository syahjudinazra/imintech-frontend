import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// Get token from localStorage
const token = localStorage.getItem('token')

// Configure axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/'
axios.defaults.withCredentials = true
axios.defaults.headers.common = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}

// Add axios request interceptor
axios.interceptors.request.use(
  (config) => {
    // Get latest token on each request
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add axios response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

// Make axios available globally
const app = createApp(App)
app.config.globalProperties.$axios = axios

app.use(store)
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component('v-select', vSelect)
app.component('VueDatePicker', VueDatePicker)
app.mount('#app')
