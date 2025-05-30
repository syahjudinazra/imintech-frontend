<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const stocks = ref({})
const stocksDevice = ref([])
const stocksSkuDevice = ref([])
const locations = ref([])
let addForm

// Generic function to fetch all data
const fetchAllData = async (endpoint, currentPage = 1, allData = []) => {
  try {
    const response = await axios.get(`${endpoint}`, {
      params: {
        page: currentPage,
        rowsPerPage: 5000,
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

const fetchStocksDevice = async () => {
  try {
    stocksDevice.value = await fetchAllData('stocks-device')
  } catch (error) {
    console.error('Failed to fetch stocks device data:', error)
    showToast('Failed to load device types', 'error')
  }
}

const fetchSkuDevice = async () => {
  try {
    stocksSkuDevice.value = await fetchAllData('stocks-sku-device')
  } catch (error) {
    console.error('Failed to fetch SKU device data:', error)
    showToast('Failed to load SKU device types', 'error')
  }
}

const fetchLocations = async () => {
  try {
    locations.value = await fetchAllData('location')
  } catch (error) {
    console.error('Failed to fetch location data:', error)
    showToast('Failed to load locations', 'error')
  }
}

// Date formatting functions remain the same
const customFormat = (date) => {
  if (!date) return ''
  return formatDateForDisplay(date)
}

const formatDateForDisplay = (date) => {
  if (!date) return null
  const d = new Date(date)
  return d
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(',', '')
}

const formatDateForMySQL = (date) => {
  if (!date) return null
  const d = new Date(date)
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0') +
    ' ' +
    String(d.getHours()).padStart(2, '0') +
    ':' +
    String(d.getMinutes()).padStart(2, '0') +
    ':' +
    String(d.getSeconds()).padStart(2, '0')
  )
}

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
  // Load all initial data in parallel
  Promise.all([fetchStocksDevice(), fetchSkuDevice(), fetchLocations()]).catch((error) => {
    console.error('Error loading initial data:', error)
    showToast('Some data failed to load. Please refresh the page.', 'error')
  })
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

const addStocks = async () => {
  try {
    const formData = new FormData()
    formData.append('serial_number', stocks.value.serial_number)
    formData.append('stocks_devices_id', stocks.value.stocks_devices_id)
    formData.append('stocks_sku_devices_id', stocks.value.stocks_sku_devices_id)
    formData.append('no_invoice', stocks.value.no_invoice)
    const mysqlDate = formatDateForMySQL(stocks.value.date_in)
    formData.append('date_in', mysqlDate)
    formData.append('customers', stocks.value.customers)
    formData.append('locations_id', stocks.value.locations_id)
    formData.append('information', stocks.value.information)
    formData.append('status', stocks.value.status)

    const response = await axios.post('stocks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    showToast(response.data.message, 'success')
    closeModal()
  } catch (error) {
    console.error('Error adding data:', error)
    showToast(error.response?.data?.message || 'Failed to add data', 'error')
  }
}
</script>

<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger text-white" @click="openModal">Add Data</button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addForm"
    tabindex="-1"
    aria-labelledby="addForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addForm_label">Add Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="addStocks">
          <div class="modal-body">
            <!--Serial Number-->
            <div class="mb-3">
              <label for="Serial Number" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="stocks.serial_number"
                type="text"
                class="form-control shadow-none"
                id="serial_number"
                placeholder="Input Serial Number"
              />
            </div>

            <!--Device Type-->
            <div class="mb-3">
              <label for="stocksDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="stocks.stocks_devices_id"
                :options="stocksDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="stocksDevice"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--SKU Device Type-->
            <div class="mb-3">
              <label for="stocks_sku_devices_id" class="form-label fw-bold">SKU Device type</label>
              <v-select
                v-model="stocks.stocks_sku_devices_id"
                :options="stocksSkuDevice"
                :reduce="(sku) => sku.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select SKU Device Type"
                id="stocks_devices_id"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--No Invoice-->
            <div class="mb-3">
              <label for="no_invoice" class="form-label fw-bold">No Invoice</label>
              <input
                v-model="stocks.no_invoice"
                type="text"
                class="form-control shadow-none"
                id="no_invoice"
                placeholder="Input No Invoice"
              />
            </div>

            <!--Date in-->
            <div class="form-group mb-3">
              <label class="fw-bold" for="date_in">Date of Entry</label>
              <VueDatePicker
                v-model="stocks.date_in"
                :enable-time-picker="false"
                :format="customFormat"
                placeholder="Select Date"
              />
            </div>

            <!--Customers-->
            <div class="mb-3">
              <label for="customers" class="form-label fw-bold">Customers</label>
              <input
                v-model="stocks.customers"
                type="text"
                class="form-control shadow-none"
                id="customers"
                placeholder="Input Customers"
              />
            </div>

            <!--Location-->
            <div class="mb-3">
              <label for="location" class="form-label fw-bold">Location</label>
              <v-select
                v-model="stocks.locations_id"
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

            <!--Shipping Code-->
            <div class="mb-3">
              <label for="shipping_code" class="form-label fw-bold">Shipping Code</label>
              <input
                v-model="stocks.shipping_code"
                type="text"
                class="form-control shadow-none"
                id="shipping_code"
                placeholder="Input Shipping Code (Optional)"
              />
            </div>

            <!--Information-->
            <div class="mb-3">
              <label for="information" class="form-label fw-bold">Information</label>
              <textarea
                v-model="stocks.information"
                type="text"
                class="form-control shadow-none"
                id="information"
                placeholder="Input Information"
              />
            </div>

            <!--Status-->
            <div class="mb-3">
              <label class="form-label fw-bold">Status</label>
              <div class="form-check">
                <input
                  class="form-check-input shadow-none"
                  v-model="stocks.status"
                  type="radio"
                  name="status"
                  id="status-warehouse"
                  value="Warehouse"
                />
                <label class="form-check-label" for="status-warehouse">Warehouse</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input shadow-none"
                  v-model="stocks.status"
                  type="radio"
                  name="status"
                  id="status-services"
                  value="Services"
                />
                <label class="form-check-label" for="status-services">Services</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input shadow-none"
                  v-model="stocks.status"
                  type="radio"
                  name="status"
                  id="status-loan"
                  value="Loan"
                />
                <label class="form-check-label" for="status-loan">Loan</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input shadow-none"
                  v-model="stocks.status"
                  type="radio"
                  name="status"
                  id="status-sold"
                  value="Sold"
                />
                <label class="form-check-label" for="status-sold">Sold</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input shadow-none"
                  v-model="stocks.status"
                  type="radio"
                  name="status"
                  id="status-damage"
                  value="Damage"
                />
                <label class="form-check-label" for="status-damage">Damage</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input shadow-none"
                  v-model="stocks.status"
                  type="radio"
                  name="status"
                  id="status-entrust"
                  value="Entrust"
                />
                <label class="form-check-label" for="status-entrust">Entrust</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-danger text-white" :disabled="isLoading">
              {{ isLoading ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus,
textarea:focus,
select:focus,
.v-select.vs--open .vs__dropdown-toggle {
  border-color: #d22c36;
}

input[type='radio']:checked {
  border-color: #d22c36;
  background-color: #d22c36;
}
.v-select {
  --vs-controls-color: #6c757d;
  --vs-border-color: #ced4da;

  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.v-select .vs__dropdown-toggle {
  padding: 0;
  border: none;
}

.v-select .vs__selected-options {
  padding: 0;
}

.v-select .vs__search::placeholder {
  color: #6c757d;
}

.v-select .vs__clear {
  display: none;
}
</style>
