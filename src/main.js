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

const token = localStorage.getItem('token')
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/'
axios.defaults.headers.common = { Authorization: `Bearer ${token}` }

const app = createApp(App)

app.use(store)
app.use(router)
app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component('v-select', vSelect)

app.mount('#app')
