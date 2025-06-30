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

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['login', 'register', 'forgot-password', 'reset-password']

// Function to check if route is public
const isPublicRoute = (url) => {
  return PUBLIC_ROUTES.some((route) => url?.includes(route))
}

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
  clearSession()
} else if (token) {
  setTokenWithExpiry(token)
}

// Configure axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/'
axios.defaults.withCredentials = true
axios.defaults.headers.common = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}

// Add axios request interceptor
axios.interceptors.request.use(
  (config) => {
    // Skip authentication and session checks for public routes
    if (isPublicRoute(config.url)) {
      return config
    }

    // Check if token is expired before each request (only for protected routes)
    if (isTokenExpired()) {
      clearSession()
      router.push('/pages/login')
      return Promise.reject(new Error('Session expired'))
    }

    // Get latest token and add to headers for protected routes
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
    // Only for authenticated requests (not public routes)
    if (!isPublicRoute(response.config.url)) {
      const currentToken = localStorage.getItem(TOKEN_KEY)
      if (currentToken) {
        setTokenWithExpiry(currentToken)
      }
    }
    return response
  },
  (error) => {
    // Handle unauthorized access (only for protected routes)
    if (error.response?.status === 401 && !isPublicRoute(error.config?.url)) {
      clearSession()
      router.push('/pages/login')
    }
    return Promise.reject(error)
  },
)

// Create event to check session periodically
const checkSessionInterval = setInterval(() => {
  if (isTokenExpired()) {
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
    // Update axios default header after setting token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return true
  },
  clearSession: () => {
    clearSession()
    // Remove authorization header when clearing session
    delete axios.defaults.headers.common['Authorization']
  },
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
