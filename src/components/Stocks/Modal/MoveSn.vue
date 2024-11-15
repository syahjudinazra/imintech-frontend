<template>
  <div class="d-flex">
    <!-- Main Content -->
    <div class="flex-grow-1">
      <button type="button" class="btn btn-secondary btn-sm" @click="openModal">
        <CIcon :icon="cilTruck" style="color: white" />
        <span>Move SN</span>
      </button>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="modal fade show modal-overlay"
        style="display: block"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Moving SN</h1>
              <button
                type="button"
                class="btn-close"
                @click="closeModal"
                aria-label="Close"
              ></button>
            </div>

            <!-- Serial Number Input View -->
            <div v-if="!showEditForm" class="modal-body">
              <div class="d-flex justify-content-between">
                <div class="w-30">
                  <textarea
                    v-model="serialNumbers"
                    class="moveSn-area form-control shadow-none"
                    rows="9"
                    placeholder="Enter SN (Multiple SN can separated by enter)"
                  ></textarea>
                  <button
                    @click="searchSerialNumbers"
                    class="btn btn-outline-danger btn-sm mt-2"
                    style="bottom: 10px; right: 10px"
                    :disabled="!serialNumbers.trim()"
                  >
                    Add SN
                  </button>
                </div>

                <div class="flex-grow-1 ms-3">
                  <EasyDataTable
                    @update:options="handleTableUpdate"
                    :headers="headers"
                    :items="selectedSerialNumbers"
                    :loading="loading"
                    :theme-color="baseColor"
                    table-class-name="head-table"
                    :rows-per-page="5"
                    alternating
                    border-cell
                    buttons-pagination
                  >
                    <template #item-stocks_devices_id="{ stocks_devices_id }">
                      {{ getDeviceName(stocks_devices_id) }}
                    </template>
                    <template #item-customers_id="{ customers_id }">
                      {{ getCustomerName(customers_id) }}
                    </template>
                    <template #item-action="{ serial_number }">
                      <a
                        @click="removeSerialNumber(serial_number)"
                        href="#"
                        class="text-decoration-none"
                      >
                        Delete
                      </a>
                    </template>
                  </EasyDataTable>
                </div>
              </div>
            </div>

            <!-- Edit Form View -->
            <div v-else class="modal-body">
              <form @submit.prevent="handleSubmit">
                <!-- Status -->
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <div class="d-flex gap-3">
                    <div v-for="option in statusOptions" :key="option.value">
                      <input
                        type="radio"
                        :id="option.value"
                        v-model="formData.status"
                        :value="option.value"
                        class="form-check-input"
                      />
                      <label :for="option.value" class="form-check-label ms-1">
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </div>

                <!--Customers-->
                <div class="mb-3">
                  <label for="customers_id" class="form-label fw-bold">Customers</label>
                  <v-select
                    v-model="formData.customers_id"
                    :options="customers"
                    :reduce="(customer) => customer.id"
                    label="name"
                    :searchable="true"
                    :clearable="false"
                    placeholder="Select Customers"
                    id="customers_id"
                  >
                    <template #no-options="{ search, searching }">
                      <template v-if="searching">
                        No results found for <em>{{ search }}</em>
                      </template>
                      <em v-else>Start typing to search...</em>
                    </template>
                  </v-select>
                </div>

                <!-- Date exit -->
                <div class="mb-3">
                  <label class="form-label">Date exit</label>
                  <VueDatePicker :enable-time-picker="false" v-model="formData.date_exit" />
                </div>

                <!--Location-->
                <div class="mb-3">
                  <label for="location" class="form-label fw-bold">Location</label>
                  <v-select
                    v-model="formData.locations_id"
                    :options="locations"
                    :reduce="(location) => location.id"
                    label="name"
                    :searchable="true"
                    :clearable="false"
                    placeholder="Select Location"
                    id="location"
                  >
                    <template #no-options="{ search, searching }">
                      <template v-if="searching">
                        No results found for <em>{{ search }}</em>
                      </template>
                      <em v-else>Start typing to search...</em>
                    </template>
                  </v-select>
                </div>

                <!-- Information -->
                <div class="mb-3">
                  <label class="form-label">Information</label>
                  <textarea
                    v-model="formData.information"
                    class="form-control shadow-none"
                    rows="3"
                    placeholder="Input Information"
                  ></textarea>
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <!-- Show Cancel button only in initial view -->
              <button
                v-if="!showEditForm"
                type="button"
                class="btn btn-outline-secondary btn-sm"
                @click="closeModal"
              >
                Cancel
              </button>

              <!-- Show Back and Submit buttons in edit form -->
              <template v-else>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="showEditForm = false"
                >
                  Back
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm text-white"
                  @click="handleSubmit"
                  :disabled="!formData.status"
                >
                  Submit
                </button>
              </template>

              <!-- Show Next button only in initial view -->
              <button
                v-if="!showEditForm"
                type="button"
                class="btn btn-danger btn-sm text-white"
                @click="handleNext"
                :disabled="selectedSerialNumbers.length === 0"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CheckSnSideBar :is-visible="showSidebar" :results="searchResults" @close="closeSidebar" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CIcon } from '@coreui/icons-vue'
import { cilTruck } from '@coreui/icons'
import axios from 'axios'
import CheckSnSideBar from './CheckSnSideBar.vue'

// State management
const stocksDevice = ref([])
const customers = ref([])
const loading = ref(false)
const showModal = ref(false)
const serialNumbers = ref('')
const showSidebar = ref(false)
const searchResults = ref([])
const showEditForm = ref(false)
const selectedSerialNumbers = ref([])

const formData = ref({
  status: '',
  customers_id: '',
  date_exit: '',
  locations_id: '',
  information: '',
})

const props = defineProps({
  customer: {
    type: Array,
    required: true,
  },
  location: {
    type: Array,
    required: true,
  },
  stocksDevices: {
    type: Array,
    required: true,
  },
})

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Serial Number', value: 'serial_number' },
  { text: 'Customers', value: 'customers_id' },
  { text: 'Devices', value: 'stocks_devices_id' },
  { text: 'Status', value: 'status' },
  { text: 'Action', value: 'action' },
])

const statusOptions = [
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Services', label: 'Services' },
  { value: 'Loan', label: 'Loan' },
  { value: 'Sold', label: 'Sold' },
  { value: 'Damage', label: 'Damage' },
  { value: 'Entrust', label: 'Entrust' },
]

// Device name lookup
const getDeviceName = (id) => {
  const device = stocksDevice.value.find((d) => d.id === id)
  return device ? device.name : 'Unknown'
}

const getCustomerName = (id) => {
  const customer = customers.value.find((d) => d.id === id)
  return customer ? customer.name : 'Unknown'
}

const removeSerialNumber = (serial_number) => {
  const index = selectedSerialNumbers.value.findIndex(
    (item) => item.serial_number === serial_number,
  )
  if (index !== -1 && selectedSerialNumbers.value.length > 1) {
    selectedSerialNumbers.value.splice(index, 1)
  }
}

const closeSidebar = () => {
  showSidebar.value = false
  // Optional: Clear results after animation completes
  setTimeout(() => {
    searchResults.value = []
  }, 300)
}

// Modal controls
const openModal = () => {
  showModal.value = true
  document.body.classList.add('modal-open')
}

const closeModal = () => {
  showModal.value = false
  showEditForm.value = false
  document.body.classList.remove('modal-open')
  resetForm()
}

const resetForm = () => {
  formData.value = {
    status: '',
    customers_id: '',
    date_exit: '',
    locations_id: '',
    information: '',
  }
  serialNumbers.value = ''
  selectedSerialNumbers.value = []
  searchResults.value = []
  showSidebar.value = false
}

const checkSerialNumberInDB = async (sn) => {
  try {
    const response = await axios.get(`stocks/check/${sn}`)
    return {
      found: true,
      data: response.data,
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { found: false }
    }
    throw error
  }
}

const searchSerialNumbers = async () => {
  const snArray = serialNumbers.value.split('\n').filter((sn) => sn.trim())

  loading.value = true
  searchResults.value = []
  selectedSerialNumbers.value = []

  try {
    for (const sn of snArray) {
      const result = await checkSerialNumberInDB(sn.trim())
      searchResults.value.push({
        serialNumber: sn.trim(),
        found: result.found,
        data: result.data,
      })
      if (result.found) {
        selectedSerialNumbers.value.push(result.data)
      }
    }
    showSidebar.value = true
  } catch (error) {
    console.error('Error searching serial numbers:', error)
  } finally {
    loading.value = false
  }
}

const handleNext = () => {
  if (selectedSerialNumbers.value.length > 0) {
    showEditForm.value = true
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.put('stocks/' + selectedSerialNumbers.value, {
      serialNumbers: selectedSerialNumbers.value,
      formData: formData.value,
    })
    stocksDevice.value = response.data.data
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.moveSn-area {
  width: 100%;
  resize: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #d22c36;
  box-shadow: 0 0 0 0.25rem rgba(210, 44, 54, 0.25);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.btn:hover {
  color: #fff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-content {
  padding: 1rem;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.search-result-item {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.serial-number {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.status {
  font-size: 0.875rem;
}

.text-success {
  color: #198754;
}

.text-danger {
  color: #dc3545;
}

.no-results {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.w-30 {
  width: 30%;
}

.form-check-input:checked {
  background-color: #d22c36;
  border-color: #d22c36;
}

.modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Animation Classes */
.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-slide-out {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

/* Enhanced sidebar styles */
.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 350px;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  overflow-x: hidden;
}

.sidebar-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}

.sidebar-content {
  padding: 1rem;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.search-result-item {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s ease;
}

.search-result-item:hover {
  background-color: #f8f9fa;
}

.serial-number {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #212529;
}

.status {
  font-size: 0.875rem;
  font-weight: 500;
}

.text-success {
  color: #198754;
}

.text-danger {
  color: #dc3545;
}

.no-results {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
  font-style: italic;
}

/* Tabs styling */
.tabs {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.tab-item {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #6c757d;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.tab-item.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
}

/* Results table styling */
.results-table {
  width: 100%;
}

.table-header {
  display: flex;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 500;
  font-size: 0.875rem;
}

.table-row {
  display: flex;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.875rem;
}

.col-sn {
  flex: 2;
}

.col-state {
  flex: 1;
}

.text-success {
  color: #198754;
}

.text-danger {
  color: #dc3545;
}

/* Animation Classes */
.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-slide-out {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
