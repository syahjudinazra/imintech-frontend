<template>
  <div
    class="modal fade"
    id="viewForm"
    tabindex="-1"
    aria-labelledby="viewForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="viewForm_label">View Stock</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <!--Serial Number-->
          <div class="mb-3">
            <label class="form-label fw-bold">Serial Number</label>
            <input
              class="form-control shadow-none bg-light"
              v-model="stockDetails.serial_number"
              id="serial_number"
              name="serial_number"
              readonly
            />
          </div>

          <!--Device Type-->
          <div class="mb-3">
            <label class="form-label fw-bold">Device Type</label>
            <input
              class="form-control shadow-none bg-light"
              :value="getDeviceName(stockDetails.stocks_devices_id)"
              id="stocks_devices_id"
              name="stocks_devices_id"
              readonly
            />
          </div>

          <!--SKU Device Type-->
          <div class="mb-3">
            <label class="form-label fw-bold">SKU Device Type</label>
            <input
              class="form-control shadow-none bg-light"
              :value="getSkuDeviceName(stockDetails.stocks_sku_devices_id)"
              readonly
            />
          </div>

          <!--No Invoice-->
          <div class="mb-3">
            <label class="form-label fw-bold">No Invoice</label>
            <input
              class="form-control shadow-none bg-light"
              v-model="stockDetails.no_invoice"
              id="no_invoice"
              name="no_invoice"
              readonly
            />
          </div>

          <!-- Date in -->
          <div class="mb-3">
            <label class="fw-bold">Date of Entry</label>
            <VueDatePicker
              class="shadow-none bg-light"
              v-model="stockDetails.date_in"
              :enable-time-picker="false"
              :format="customDateFormat"
              :model-value="formatDateForPicker(stockDetails.date_in)"
              id="date_in"
              name="date_in"
              placeholder="Select Date"
              readonly
            />
          </div>

          <!-- Date out -->
          <div class="mb-3">
            <label class="fw-bold">Date Exit</label>
            <VueDatePicker
              class="shadow-none bg-light"
              v-model="stockDetails.date_out"
              :enable-time-picker="false"
              :format="customDateFormat"
              :model-value="formatDateForPicker(stockDetails.date_out)"
              id="date_out"
              name="date_out"
              placeholder="Select Date"
              readonly
            />
          </div>

          <!--Customers-->
          <div class="mb-3">
            <label class="form-label fw-bold">Customer</label>
            <input
              class="form-control shadow-none bg-light"
              :value="getCustomerName(stockDetails.customers_id)"
              readonly
            />
          </div>

          <!--Location-->
          <div class="mb-3">
            <label class="form-label fw-bold">Location</label>
            <input
              class="form-control shadow-none bg-light"
              :value="getLocationName(stockDetails.locations_id)"
              readonly
            />
          </div>

          <!--Information-->
          <div class="mb-3">
            <label class="form-label fw-bold">Information</label>
            <textarea
              class="form-control shadow-none bg-light"
              v-model="stockDetails.information"
              placeholder="Enter information here"
              readonly
            >
            </textarea>
          </div>

          <!--Status-->
          <div class="mb-3">
            <label class="form-label fw-bold">Status</label>
            <input
              class="form-control shadow-none bg-light"
              v-model="stockDetails.status"
              id="status"
              name="status"
              readonly
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const emit = defineEmits(['close'])
const stockDetails = ref({})
const stocksDevice = ref([])
const customers = ref([])
const locations = ref([])
const skuDevices = ref([])

let viewModal

// Date formatting
const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const formatDate = (date) => {
  if (!date) return '-'

  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return '-'

    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

const getDeviceName = (id) => {
  const device = stocksDevice.value.find((d) => d.id === id)
  return device ? device.name : 'N/A'
}

const getSkuDeviceName = (id) => {
  const skuDevice = skuDevices.value.find((s) => s.id === id)
  return skuDevice ? skuDevice.name : 'N/A'
}

const getCustomerName = (id) => {
  const customer = customers.value.find((c) => c.id === id)
  return customer ? customer.name : 'N/A'
}

const getLocationName = (id) => {
  const location = locations.value.find((l) => l.id === id)
  return location ? location.name : 'N/A'
}

const fetchStocksDevice = async () => {
  try {
    const response = await axios.get('stocks-device')
    stocksDevice.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
  }
}

const fetchSkuDevice = async () => {
  try {
    const response = await axios.get('stocks-sku-device')
    skuDevices.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
  }
}

const fetchCustomers = async () => {
  try {
    const response = await axios.get('customers')
    customers.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
  }
}

const fetchLocations = async () => {
  try {
    const response = await axios.get('location')
    locations.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
  }
}

const showModal = (stock) => {
  stockDetails.value = {
    ...stock,
    date_in: stock.date_in ? new Date(stock.date_in) : null,
    date_out: stock.date_out ? new Date(stock.date_out) : null,
  }
  viewModal.show()
}

const closeModal = () => {
  hideModal()
  emit('close')
}

const hideModal = () => {
  viewModal.hide()
  stockDetails.value = {}
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  fetchStocksDevice()
  fetchSkuDevice()
  fetchCustomers()
  fetchLocations()
  formatDate()
  viewModal = new Modal(document.getElementById('viewForm'))
})
</script>

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}

.dp__theme_light {
  --dp-background-color: #f8f9fa;
}

.dp__theme_dark {
  --dp-background-color: #f8f9fa;
}
</style>
