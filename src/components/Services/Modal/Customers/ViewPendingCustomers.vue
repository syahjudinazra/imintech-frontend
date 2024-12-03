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
          <!--Ticket Services-->
          <div class="mb-3">
            <label class="form-label fw-bold">Ticket Services</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.ticket_services"
              id="ticket_services"
              name="ticket_services"
              readonly
            />
          </div>

          <!--Owner-->
          <div class="mb-3">
            <label class="form-label fw-bold">Owner</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.owner"
              id="owner"
              name="owner"
              readonly
            />
          </div>

          <!--Customers-->
          <div class="mb-3">
            <label class="fw-bold" for="customers">Customers</label>
            <input
              :value="service?.customers"
              type="text"
              class="form-control shadow-none bg-light"
              id="customers"
              readonly
            />
          </div>

          <!--Device Type-->
          <div class="mb-3">
            <label class="form-label fw-bold">Device Type</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.services_devices_id"
              id="services_devices_id"
              name="services_devices_id"
              readonly
            />
          </div>

          <!--Serial Number-->
          <div class="mb-3">
            <label class="form-label fw-bold">Serial Number</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.serial_number"
              id="serial_number"
              name="serial_number"
              readonly
            />
          </div>

          <!--Usages-->
          <div class="mb-3">
            <label class="form-label fw-bold">Usages</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.usages_id"
              id="usages_id"
              name="usages_id"
              readonly
            />
          </div>

          <!--Spareparts Number-->
          <div class="mb-3" v-if="sparepartRequests && sparepartRequests.length > 0">
            <label class="form-label fw-bold">No Spareparts Request</label>
            <input
              class="form-control shadow-none bg-light"
              :value="formatSparepartNumbers(sparepartRequests)"
              readonly
            />
          </div>

          <!--Damage-->
          <div class="mb-3">
            <label class="fw-bold" for="damage">Damage</label>
            <textarea
              :value="service?.damage"
              class="form-control shadow-none bg-light"
              id="damage"
              readonly
            ></textarea>
          </div>

          <!-- Date in -->
          <div class="mb-3">
            <label class="fw-bold">Date of Entry</label>
            <VueDatePicker
              class="shadow-none bg-light"
              :model-value="formatDateForPicker(service?.date_in_services)"
              :enable-time-picker="false"
              :format="customDateFormat"
              id="date_in_services"
              name="date_in_services"
              placeholder="Select Date"
              readonly
            />
          </div>

          <!--Note-->
          <div class="mb-3">
            <label class="fw-bold" for="note">Note</label>
            <textarea
              :value="service?.note"
              class="form-control shadow-none bg-light"
              id="note"
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
  service: {
    type: Object,
    default: () => ({}),
  },
  sparepartRequests: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close'])
let viewModal = ref(null)

const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const formatSparepartNumbers = (requests) => {
  if (!requests || requests.length === 0) return 'No spareparts requested'
  return requests.map((req) => req.no_spareparts).join(', ')
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
