<template>
  <div class="container w-50 p-3">
    <div class="row addDataForms">
      <div class="d-flex justify-content-between mb-2">
        <div class="title">
          <h1 class="h3 mb-3 text-gray-800">Add New Service</h1>
        </div>
        <div class="excel-action gap-4">
          <button
            @click="exportService"
            :class="['btn btn-success btn-sm fw-bold text-white', { disabled: isLoading }]"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Downloading...' : 'Export Excel' }}
          </button>
          <button
            @click="importService"
            :class="['btn btn-success btn-sm fw-bold text-white', { disabled: isLoading }]"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Downloading...' : 'Import Excel' }}
          </button>
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
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="ticket_services">Ticket Service</label>
          <input
            v-model="services.ticket_services"
            type="text"
            class="form-control shadow-none"
            id="ticket_services"
            placeholder="Input Ticket Service"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="date_in_services">Date of Entry</label>
          <VueDatePicker v-model="services.date_in_services" />
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
        <div class="form-group mb-3">
          <label for="status" class="form-label fw-bold">Status</label>
          <div class="d-flex gap-2">
            <div class="form-check">
              <input
                v-model="services.status"
                class="form-check-input"
                type="checkbox"
                id="status"
              />
              <label class="form-check-label" for="status">Pending</label>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-danger text-white">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  status: false,
})

const servicesDevice = ref([])
const usages = ref([])
const isLoading = ref(false)

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
      formData.append(key, value)
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
    showToast(error.data.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const clearInput = () => {
  Object.keys(services.value).forEach((key) => {
    services.value[key] = key === 'note' ? 'Tanggal Pembelian:\nKelengkapan:' : ''
  })
  services.value.status = false
}

const exportService = () => {
  // Implement export functionality
  console.log('Export service')
}

const importService = () => {
  // Implement import functionality
  console.log('Import service')
}

onMounted(() => {
  fetchServicesDevice()
  fetchUsages()
})
</script>
<style scoped>
input:focus {
  border-color: #d22c36;
}

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
