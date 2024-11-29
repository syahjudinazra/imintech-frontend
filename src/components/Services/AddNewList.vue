<template>
  <div class="container w-50 p-3">
    <div class="row addDataForms">
      <div class="d-flex justify-content-between mb-2">
        <div class="title">
          <h1 class="h3 mb-3 text-gray-800">Add New Service</h1>
        </div>
      </div>
      <hr class="w-100" />
      <form @submit.prevent="addServices" class="mb-4" enctype="multipart/form-data">
        <div class="form-group mb-3">
          <label class="fw-bold" for="serial_number">Serial Number</label>
          <input
            v-model="services.serial_number"
            type="text"
            class="form-control shadow-none"
            id="serial_number"
            placeholder="Input Serial Number"
            required
          />
          <small class="text-secondary">The serial number must be in the stocks data</small>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="ticket_services">Ticket Service</label>
          <div class="d-flex">
            <input
              v-model="services.ticket_services"
              type="text"
              class="form-control shadow-none"
              id="ticket_services"
              placeholder="Input Ticket Service"
              readonly
            />
            <button @click="generateTicketService" type="button" class="btn btn-secondary ms-2">
              Generate
            </button>
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="date_in_services">Date of Entry</label>
          <VueDatePicker v-model="services.date_in_services" :enable-time-picker="false" />
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold">Owner</label><br />
          <div class="form-check form-check-inline">
            <input
              v-model="services.owner"
              class="form-check-input mt-1"
              type="radio"
              id="stocks"
              value="Stocks"
              @change="updateCustomers"
            />
            <label class="form-check-label" for="stocks">Stocks</label>
          </div>
          <div class="form-check form-check-inline mb-3">
            <input
              v-model="services.owner"
              class="form-check-input mt-1"
              type="radio"
              id="customers"
              value="Customers"
              @change="updateCustomers"
            />
            <label class="form-check-label" for="customers">Customers</label>
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="customers">Customers</label>
          <input
            v-model="services.customers"
            type="text"
            class="form-control shadow-none"
            id="customers"
            placeholder="Input Customers"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label for="services_devices_id" class="form-label fw-bold">Device type</label>
          <v-select
            v-model="services.services_devices_id"
            :options="servicesDevice"
            label="name"
            :reduce="(device) => device.id"
            :searchable="true"
            :clearable="false"
            placeholder="Select Device Type"
          >
            <template #no-options="{ search, searching }">
              {{ searching ? `No results found for "${search}"` : 'Start typing to search...' }}
            </template>
          </v-select>
        </div>
        <div class="form-group mb-3">
          <label for="usages_id" class="form-label fw-bold">Choose Usage</label>
          <v-select
            v-model="services.usages_id"
            :options="usages"
            label="name"
            :reduce="(usage) => usage.id"
            :searchable="true"
            :clearable="false"
            placeholder="Choose Usage"
          >
            <template #no-options="{ search, searching }">
              {{ searching ? `No results found for "${search}"` : 'Start typing to search...' }}
            </template>
          </v-select>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="damage">Damage</label>
          <textarea
            v-model="services.damage"
            class="form-control shadow-none"
            id="damage"
            placeholder="Input Damage"
            required
          ></textarea>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="note">Notes</label>
          <textarea
            v-model="services.note"
            class="form-control shadow-none"
            id="note"
            placeholder="Input Notes"
            required
          ></textarea>
        </div>
        <div class="form-group mb-3" hidden>
          <label for="status" class="form-label fw-bold">Status</label>
          <div class="d-flex gap-2">
            <div class="form-check">
              <input
                v-model="services.status"
                class="form-check-input"
                type="radio"
                name="status"
                id="statusPending"
                value="Pending Customers"
              />
              <label class="form-check-label" for="statusPending">Pending Customers</label>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-danger text-white">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const services = ref({
  serial_number: '',
  ticket_services: '',
  date_in_services: null,
  owner: '',
  customers: '',
  services_devices_id: null,
  usages_id: null,
  damage: '',
  note: 'Tanggal Pembelian:\nKelengkapan:',
  status: 'Pending Customers',
})

const servicesDevice = ref([])
const usages = ref([])
const isLoading = ref(false)

const updateCustomers = () => {
  if (services.value.owner === 'Stocks') {
    services.value.customers = 'iMin ID'
  } else {
    services.value.customers = ''
  }
}

function generateTicketService() {
  const date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()
  const randomNum = Math.floor(Math.random() * 1000) + 1 // Random number between 1 and 1000
  services.value.ticket_services = `C-${day}/${month}/${year}/${randomNum}`
}

watch(
  () => services.value.owner,
  () => {
    updateCustomers()
  },
)

const fetchServicesDevice = async () => {
  try {
    const response = await axios.get('services-device')
    servicesDevice.value = response.data.data
  } catch (error) {
    console.error('Error fetching services device:', error)
  }
}

const fetchUsages = async () => {
  try {
    const response = await axios.get('usages')
    usages.value = response.data.data
  } catch (error) {
    console.error('Error fetching usages:', error)
  }
}

const addServices = async () => {
  try {
    isLoading.value = true
    const formData = new FormData()
    Object.entries(services.value).forEach(([key, value]) => {
      if (key === 'date_in_services' && value) {
        formData.append(key, new Date(value).toISOString().split('T')[0])
      } else {
        formData.append(key, value)
      }
    })

    const response = await axios.post('services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    showToast(response.data.message, 'success')
    clearInput()
  } catch (error) {
    console.error('Error adding service:', error)
    if (error.response && error.response.data && error.response.data.message) {
      showToast(error.response.data.message, 'error')
    } else {
      showToast('An error occurred while adding the service', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

const clearInput = () => {
  Object.keys(services.value).forEach((key) => {
    if (key === 'note') {
      services.value[key] = 'Tanggal Pembelian:\nKelengkapan:'
    } else if (key === 'status') {
      services.value[key] = 'Pending'
    } else {
      services.value[key] = ''
    }
  })
  services.value.date_in_services = null
}

onMounted(() => {
  fetchServicesDevice()
  fetchUsages()
})
</script>

<style scoped>
input:focus,
textarea:focus {
  border-color: #d22c36;
}

.addDataForms {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1rem;
}

.disabled {
  pointer-events: none;
  opacity: 0.65;
}
</style>
