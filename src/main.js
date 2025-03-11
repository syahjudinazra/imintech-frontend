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

// Session management variables
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const TOKEN_KEY = 'token'
const TOKEN_EXPIRY_KEY = 'tokenExpiry'

// Function to check if token is expired
const isTokenExpired = () => {
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!expiryTime) return true
  return new Date().getTime() > parseInt(expiryTime)
}

// Function to set token with expiry
const setTokenWithExpiry = (token) => {
  if (!token) return

  const expiryTime = new Date().getTime() + SESSION_DURATION
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())

  // For debugging
  console.log('Token set with expiry:', new Date(expiryTime).toLocaleTimeString())
}

// Function to clear token and session data
const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
}

// Initialize token handling
const token = localStorage.getItem(TOKEN_KEY)

// Check if token is expired on application start
if (token && isTokenExpired()) {
  console.log('Token expired on app start')
  clearSession()
  // Will redirect to login via router guard or axios interceptor
} else if (token) {
  // Reset expiry time if token is still valid (sliding expiration)
  setTokenWithExpiry(token)
}

// Configure axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/'
axios.defaults.withCredentials = true
axios.defaults.headers.common = {
  Authorization: token ? `Bearer ${token}` : '',
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}

// Add axios request interceptor
axios.interceptors.request.use(
  (config) => {
    // Skip session check for login request
    if (config.url === 'login') {
      return config
    }

    // Check if token is expired before each request
    if (isTokenExpired()) {
      console.log('Token expired during request')
      clearSession()
      router.push('/pages/login')
      return Promise.reject(new Error('Session expired'))
    }

    // Get latest token on each request
    const currentToken = localStorage.getItem(TOKEN_KEY)
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add axios response interceptor
axios.interceptors.response.use(
  (response) => {
    // If request was successful and we have a token, extend the session
    const currentToken = localStorage.getItem(TOKEN_KEY)
    if (currentToken) {
      setTokenWithExpiry(currentToken)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      clearSession()
      router.push('/pages/login')
    }
    return Promise.reject(error)
  },
)

// Create event to check session periodically
const checkSessionInterval = setInterval(() => {
  if (isTokenExpired()) {
    console.log('Token expired during interval check')
    clearSession()
    router.push('/pages/login')
    clearInterval(checkSessionInterval)
  }
}, 60000) // Check every minute

// Make axios and session management available globally
const app = createApp(App)
app.config.globalProperties.$axios = axios

// Expose session management functions to the app
app.config.globalProperties.$auth = {
  setToken: (token) => {
    setTokenWithExpiry(token)
    return true
  },
  clearSession,
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY) && !isTokenExpired()
  },
  refreshSession: () => {
    const currentToken = localStorage.getItem(TOKEN_KEY)
    if (currentToken) {
      setTokenWithExpiry(currentToken)
      return true
    }
    return false
  },
  getExpiryTime: () => {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
    return expiryTime ? new Date(parseInt(expiryTime)) : null
  },
}

app.use(store)
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component('v-select', vSelect)
app.component('VueDatePicker', VueDatePicker)

// Handle cleanup when app is unmounted
app.unmount = () => {
  clearInterval(checkSessionInterval)
}

app.mount('#app')
