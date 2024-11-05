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
              v-model="stockDetails.stocks_devices_id"
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
              v-model="stockDetails.stocks_sku_devices_id"
              id="stocks_sku_devices_id"
              name="stocks_sku_devices_id"
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
              id="date_in"
              name="date_in"
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
              id="date_out"
              name="date_out"
              readonly
            />
          </div>

          <!--Customers-->
          <div class="mb-3">
            <label class="form-label fw-bold">Customer</label>
            <input
              class="form-control shadow-none bg-light"
              v-model="stockDetails.customers_id"
              id="customers_id"
              name="customers_id"
              readonly
            />
          </div>

          <!--Location-->
          <div class="mb-3">
            <label class="form-label fw-bold">Location</label>
            <input
              class="form-control shadow-none bg-light"
              v-model="stockDetails.locations_id"
              id="locations_id"
              name="locations_id"
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

const emit = defineEmits(['close'])
const stockDetails = ref({})
let viewModal

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
