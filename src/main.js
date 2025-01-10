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

// Configure axios defaults with environment-based base URL
const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://127.0.0.1:8000/api/v1/'
    : 'https://backend.imin.co.id/api/v1/'

// Configure axios defaults
axios.defaults.baseURL = baseURL
axios.defaults.withCredentials = true // Enable credentials
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

// Create and configure Vue application
const app = createApp(App)

// Make axios available globally
app.config.globalProperties.$axios = axios

// Use plugins and components
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component('v-select', vSelect)
app.component('VueDatePicker', VueDatePicker)

// Mount the application
app.mount('#app')
