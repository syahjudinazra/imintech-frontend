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
          <h5 class="modal-title" id="viewForm_label">View Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <!-- Date of Entry -->
          <div class="mb-3">
            <label class="fw-bold">Date of Entry</label>
            <VueDatePicker
              class="shadow-none bg-light"
              :model-value="formatDateForPicker(loan?.date_loan)"
              :enable-time-picker="false"
              :format="customDateFormat"
              id="date_loan"
              name="date_loan"
              placeholder="Select Date"
              readonly
            />
          </div>

          <!--Serial Number-->
          <div class="mb-3">
            <label class="form-label fw-bold">Serial Number</label>
            <input
              class="form-control shadow-none bg-light"
              :value="loan?.serial_number"
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
              :value="loan?.loan_devices_id"
              id="loan_devices_id"
              name="loan_devices_id"
              readonly
            />
          </div>

          <!--Ram Section-->
          <div class="mb-3">
            <label class="form-label fw-bold">RAM</label>
            <input
              class="form-control shadow-none bg-light"
              :value="loan?.rams_id"
              id="rams_id"
              name="rams_id"
              readonly
            />
          </div>

          <!--Android Section-->
          <div class="mb-3">
            <label class="form-label fw-bold">Android</label>
            <input
              class="form-control shadow-none bg-light"
              :value="loan?.androids_id"
              id="androids_id"
              name="androids_id"
              readonly
            />
          </div>

          <!--Customers Section-->
          <div class="mb-3">
            <label class="fw-bold" for="customers">Customers</label>
            <input
              :value="loan?.customers"
              type="text"
              class="form-control shadow-none bg-light"
              id="customers"
              name="customers"
              readonly
            />
          </div>

          <!--Sales Section-->
          <div class="mb-3">
            <label class="fw-bold" for="sales">Sales</label>
            <input
              :value="loan?.sales_id"
              type="text"
              class="form-control shadow-none bg-light"
              id="sales_id"
              name="sales_id"
              readonly
            />
          </div>

          <!--Phone Number Section-->
          <div class="mb-3">
            <label class="form-label fw-bold">Phone Number</label>
            <input
              class="form-control shadow-none bg-light"
              :value="loan?.phone_number"
              id="phone_number"
              name="phone_number"
              readonly
            />
          </div>

          <!--Sender Section-->
          <div class="mb-3">
            <label class="form-label fw-bold">Sender</label>
            <input
              class="form-control shadow-none bg-light"
              :value="loan?.sender"
              id="sender"
              name="sender"
              readonly
            />
          </div>

          <!--Shipping equipment Section-->
          <div class="mb-3">
            <label class="fw-bold" for="shipping_equipment">Shipping equipment</label>
            <textarea
              :value="loan?.shipping_equipment"
              class="form-control shadow-none bg-light"
              id="shipping_equipment"
              readonly
            ></textarea>
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
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  loan: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])
let viewModal = ref(null)

const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const showModal = () => {
  viewModal.value.show()
}

const closeModal = () => {
  viewModal.value.hide()
  emit('close')
}

const hideModal = () => {
  viewModal.value.hide()
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  viewModal.value = new Modal(document.getElementById('viewForm'))
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
