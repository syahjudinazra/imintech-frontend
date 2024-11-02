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
            <p class="form-control-static">{{ stockDetails?.serial_number || '-' }}</p>
          </div>

          <!--Device Type-->
          <div class="mb-3">
            <label class="form-label fw-bold">Device Type</label>
            <p class="form-control-static">{{ getDeviceName(stockDetails?.stocks_devices_id) }}</p>
          </div>

          <!--SKU Device Type-->
          <div class="mb-3">
            <label class="form-label fw-bold">SKU Device Type</label>
            <p class="form-control-static">
              {{ getSkuDeviceName(stockDetails?.stocks_sku_devices_id) }}
            </p>
          </div>

          <!--No Invoice-->
          <div class="mb-3">
            <label class="form-label fw-bold">No Invoice</label>
            <p class="form-control-static">{{ stockDetails?.no_invoice || '-' }}</p>
          </div>

          <!--Date in-->
          <div class="mb-3">
            <label class="fw-bold">Date of Entry</label>
            <p class="form-control-static">{{ formatDate(stockDetails?.date_in) }}</p>
          </div>

          <!--Date out-->
          <div class="mb-3">
            <label class="fw-bold">Date Exit</label>
            <p class="form-control-static">{{ formatDate(stockDetails?.date_out) }}</p>
          </div>

          <!--Customers-->
          <div class="mb-3">
            <label class="form-label fw-bold">Customer</label>
            <p class="form-control-static">{{ getCustomerName(stockDetails?.customers_id) }}</p>
          </div>

          <!--Location-->
          <div class="mb-3">
            <label class="form-label fw-bold">Location</label>
            <p class="form-control-static">{{ getLocationName(stockDetails?.locations_id) }}</p>
          </div>

          <!--Information-->
          <div class="mb-3">
            <label class="form-label fw-bold">Information</label>
            <p class="form-control-static whitespace-pre-line">
              {{ stockDetails?.information || '-' }}
            </p>
          </div>

          <!--Status-->
          <div class="mb-3">
            <label class="form-label fw-bold">Status</label>
            <p class="form-control-static whitespace-pre-line">
              {{ stockDetails?.status || '-' }}
            </p>
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
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { format } from 'date-fns'

const props = defineProps({
  stocksDevice: {
    type: Array,
    default: () => [],
  },
  stocksSkuDevice: {
    type: Array,
    default: () => [],
  },
  customers: {
    type: Array,
    default: () => [],
  },
  locations: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close'])
const stockDetails = ref(null)
let viewModal

const formatDate = (date) => {
  if (!date) return '-'
  try {
    return format(new Date(date), 'dd MMM yyyy HH:mm')
  } catch (error) {
    return '-'
  }
}

const getDeviceName = (id) => {
  const device = props.stocksDevice.find((d) => d.id === id)
  return device ? device.name : '-'
}

const getSkuDeviceName = (id) => {
  const device = props.stocksSkuDevice.find((d) => d.id === id)
  return device ? device.name : '-'
}

const getCustomerName = (id) => {
  const customer = props.customers.find((c) => c.id === id)
  return customer ? customer.name : '-'
}

const getLocationName = (id) => {
  const location = props.locations.find((l) => l.id === id)
  return location ? location.name : '-'
}

const showModal = (stock) => {
  stockDetails.value = stock
  viewModal.show()
}

const closeModal = () => {
  hideModal()
  emit('close')
}

const hideModal = () => {
  viewModal.hide()
  stockDetails.value = null
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  viewModal = new Modal(document.getElementById('viewForm'))
})
</script>

<style scoped>
.form-control-static {
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  min-height: 24px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-color: #f8f9fa;
}

.whitespace-pre-line {
  white-space: pre-line;
}

.modal-dialog {
  max-width: 600px;
}

label {
  color: #212529;
  margin-bottom: 0.5rem;
}
</style>
