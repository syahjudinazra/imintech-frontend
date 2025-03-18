<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const services = ref({
  serial_number: '',
  ticket_services: '',
  date_in_services: formatDate(new Date()),
  owner: '',
  customers: '',
  pic: '',
  contact: '',
  address: '',
  services_devices_id: null,
  status: '',
  completeness: '',
})

// Define device completeness items
const deviceCompletenessItems = ref([
  { id: 'dus', label: 'Dus iMin', checked: false },
  { id: 'adaptor', label: 'Adaptor/Charger', checked: false },
  { id: 'kabel', label: 'Kabel Power/Kabel USB', checked: false },
  { id: 'printer', label: 'Printer', checked: false },
  { id: 'scanner', label: 'Scanner', checked: false },
  { id: 'docking', label: 'Docking', checked: false },
  { id: 'second_screen', label: '2nd Screen', checked: false },
  { id: 'kabel_screen', label: 'Kabel 2nd Screen', checked: false },
  { id: 'manual', label: 'Buku Manual', checked: false },
])

// Store selected completeness items
const selectedCompleteness = ref('')

// Update the selected completeness with the labels of checked items
const updateCompletenessData = () => {
  // Get all checked item labels and join them with commas
  const checkedLabels = deviceCompletenessItems.value
    .filter((item) => item.checked)
    .map((item) => item.label)
    .join(', ')

  // Store the comma-separated string
  selectedCompleteness.value = checkedLabels

  // Update the note field to include the completeness data
  updateNoteWithCompleteness()
}

// Update the note field with the completeness information
const updateNoteWithCompleteness = () => {
  // Set the completeness field to the selected completeness items
  services.value.completeness = selectedCompleteness.value
}

const servicesDevice = ref([])
const isLoading = ref(false)

function generateTicketService() {
  const date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()
  const randomNum = Math.floor(Math.random() * 1000) + 1 // Random number between 1 and 1000
  services.value.ticket_services = `C-${day}/${month}/${year}/${randomNum}`
}

// Add this helper function to format the date
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

watch(
  () => services.value.owner,
  () => {
    updateOwnerRelatedFields()
  },
)

// Add permission check utility
const checkPermission = (permissionName) => {
  try {
    const userData = JSON.parse(localStorage.getItem('users'))
    if (!userData?.permissions) return false

    // Check if the permission exists
    return userData.permissions.some(
      (permission) => permission.name.toLowerCase() === permissionName.toLowerCase(),
    )
  } catch (error) {
    console.error('Error checking permissions:', error)
    return false
  }
}

// Create computed property for permission
const canCreate = computed(() => checkPermission('Create Services'))

// Generic function to fetch all data
const fetchAllData = async (endpoint, currentPage = 1, allData = []) => {
  try {
    const response = await axios.get(`${endpoint}`, {
      params: {
        page: currentPage,
        rowsPerPage: 300,
        sortBy: 'id',
        sortType: 'asc',
      },
    })

    const { data, total } = response.data
    const combinedData = [...allData, ...data]

    // Calculate if need more pages
    const totalPages = Math.ceil(total / 100)

    if (currentPage < totalPages) {
      return await fetchAllData(endpoint, currentPage + 1, combinedData)
    }

    return combinedData
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

const fetchServicesDevice = async () => {
  try {
    servicesDevice.value = await fetchAllData('services-device')
  } catch (error) {
    console.error('Error fetching services device:', error)
  }
}

const addServices = async () => {
  try {
    isLoading.value = true
    const formData = new FormData()

    // Update note with latest completeness data before submission
    updateNoteWithCompleteness()

    // Process all fields except 'completeness' (which doesn't exist in the database)
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
    console.error('Error adding service:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    })

    if (error.response?.data?.message) {
      showToast(error.response.data.message, 'error')
    } else {
      showToast('Failed to add service. Please try again later.', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

const clearInput = () => {
  Object.keys(services.value).forEach((key) => {
    if (key === 'status') {
      services.value[key] = ''
    } else {
      services.value[key] = ''
    }
  })
  // Reset all checkboxes
  deviceCompletenessItems.value.forEach((item) => {
    item.checked = false
  })
  // Clear selected completeness
  selectedCompleteness.value = ''
  services.value.date_in_services = null
}

const updateOwnerRelatedFields = () => {
  if (services.value.owner === 'Stocks') {
    services.value.customers = 'iMin ID'
    services.value.status = 'Incoming Stocks'
  } else {
    services.value.customers = ''
    services.value.status = 'Incoming Customers'
  }
}

onMounted(() => {
  fetchServicesDevice()
  generateTicketService()
})
</script>
<template>
  <div class="container w-50 p-3">
    <div class="row addDataForms">
      <div class="d-flex justify-content-between mb-2">
        <div class="title">
          <h1 class="dark-text mb-3 text-gray-800">Incoming Service</h1>
        </div>
      </div>
      <hr class="dark-text w-100" />
      <form @submit.prevent="addServices" class="mb-4" enctype="multipart/form-data">
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="serial_number">Serial Number</label>
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

        <!--Ticket Service Section-->
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="ticket_services">Ticket Service</label>
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

        <!--Date of Entry Section-->
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="date_in_services">Date of Entry</label>
          <VueDatePicker
            v-model="services.date_in_services"
            :enable-time-picker="false"
            placeholder="Select Date"
            format="dd-MM-yyyy"
            model-type="yyyy-MM-dd"
            readonly
          />
        </div>

        <!--Owner Section-->
        <div class="form-group">
          <label class="form-label dark-text fw-bold">Owner</label><br />
          <div class="form-check form-check-inline">
            <input
              v-model="services.owner"
              class="form-check-input mt-1"
              type="radio"
              id="stocks"
              value="Stocks"
              @change="updateOwnerRelatedFields"
            />
            <label class="form-label dark-text form-check-label" for="stocks">Stocks</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              v-model="services.owner"
              class="form-check-input mt-1"
              type="radio"
              id="customers"
              value="Customers"
              @change="updateOwnerRelatedFields"
            />
            <label class="dark-text form-check-label" for="customers">Customers</label>
          </div>
        </div>

        <!--Customers Section-->
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="customers">Customers</label>
          <input
            v-model="services.customers"
            type="text"
            class="form-control shadow-none"
            id="customers"
            placeholder="Input Customers"
            required
          />
        </div>

        <!--PIC Section-->
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="pic">PIC</label>
          <input
            v-model="services.pic"
            type="text"
            class="form-control shadow-none"
            id="pic"
            placeholder="Input PIC"
            required
          />
        </div>

        <!--Contact Section-->
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="contact">Contact</label>
          <input
            v-model="services.contact"
            type="number"
            class="form-control shadow-none"
            id="contact"
            placeholder="Input Contact (0812xxxxxxx)"
          />
        </div>

        <!--Address Section-->
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="address">Address</label>
          <textarea
            v-model="services.address"
            type="number"
            class="form-control shadow-none"
            id="address"
            placeholder="Input Address"
          />
        </div>

        <!--Device Type Section-->
        <div class="form-group mb-3">
          <label for="services_devices_id" class="form-label dark-text fw-bold">Device type</label>
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

        <!--Device Completeness Section-->
        <div class="form-group mb-3">
          <label class="form-label dark-text fw-bold" for="completeness">Device Completeness</label>
          <div v-for="item in deviceCompletenessItems" :key="item.id" class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              :id="item.id"
              v-model="item.checked"
              @change="updateCompletenessData"
            />
            <label class="form-check-label" :for="item.id">{{ item.label }}</label>
          </div>
        </div>

        <!--Status Section-->
        <div class="form-group mb-3" hidden>
          <label for="status" class="form-label dark-text fw-bold">Status</label>
          <div class="d-flex gap-2">
            <div class="form-check">
              <input
                :value="'Incoming Customers'"
                v-model="services.status"
                class="form-check-input"
                type="radio"
                id="statusIncomingCustomers"
              />
              <label class="form-check-label" for="statusIncomingCustomers"
                >Incoming Customers</label
              >
            </div>
            <div class="form-check">
              <input
                :value="'Incoming Stocks'"
                v-model="services.status"
                class="form-check-input"
                type="radio"
                id="statusIncomingStocks"
              />
              <label class="form-check-label" for="statusIncomingStocks">Incoming Stocks</label>
            </div>
          </div>
        </div>
        <button
          v-if="canCreate"
          type="submit"
          class="btn btn-danger text-white"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
input:focus,
textarea:focus,
select:focus {
  border-color: #d22c36;
}

.form-check-input:checked {
  background-color: #d22c36;
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

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

[data-coreui-theme='dark'] .dark-text {
  color: #000000;
}

/* Light mode placeholder */
.v-select .vs__search::placeholder,
.v-select .vs__dropdown-toggle .vs__selected-options .vs__selected {
  color: #db1111 !important;
}

/* Dark mode placeholder */
[data-coreui-theme='dark'] .v-select .vs__search::placeholder,
[data-coreui-theme='dark'] .v-select .vs__dropdown-toggle .vs__selected-options .vs__selected {
  color: #ffffff !important;
}

/* Selected text color for dark mode */
[data-coreui-theme='dark'] .v-select .vs__selected {
  color: #ffffff !important;
}

/* Dropdown text color for dark mode */
[data-coreui-theme='dark'] .v-select .vs__dropdown-menu {
  color: #ffffff !important;
  background: #2c2c34;
}

/* Search input text color for dark mode */
[data-coreui-theme='dark'] .v-select .vs__search {
  color: #ffffff !important;
}
</style>
