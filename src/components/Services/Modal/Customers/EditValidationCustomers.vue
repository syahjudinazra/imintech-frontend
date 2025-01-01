<template>
  <div
    class="modal fade"
    id="editForm"
    tabindex="-1"
    aria-labelledby="editForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editForm_label">Edit Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="editForm">
          <div class="modal-body">
            <!--Ticket Services-->
            <div class="mb-3">
              <label for="ticket_services" class="form-label fw-bold">Ticket Services</label>
              <input
                v-model="editedService.ticket_services"
                type="text"
                class="form-control shadow-none bg-light"
                id="ticket_services"
                readonly
              />
            </div>

            <!--Owner-->
            <div class="mb-3">
              <div class="form-group">
                <label class="fw-bold">Owner</label><br />
                <div class="form-check form-check-inline">
                  <input
                    v-model="editedService.owner"
                    class="form-check-input mt-1"
                    type="radio"
                    id="stocks"
                    value="Stocks"
                  />
                  <label class="form-check-label" for="stocks">Stocks</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    v-model="editedService.owner"
                    class="form-check-input mt-1"
                    type="radio"
                    id="customers"
                    value="Customers"
                  />
                  <label class="form-check-label" for="customers">Customers</label>
                </div>
              </div>
            </div>

            <!--Customers-->
            <div class="mb-3">
              <label for="customers" class="form-label fw-bold">Customers</label>
              <input
                v-model="editedService.customers"
                type="text"
                class="form-control shadow-none"
                id="customers"
                required
              />
            </div>

            <!--Device Type-->
            <div class="mb-3">
              <label for="serviceDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="selectedDevice"
                :options="props.serviceDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="serviceDevice"
                @update:modelValue="handleDeviceChange"
              />
              <div v-if="validationErrors.services_devices_id" class="text-danger mt-1">
                {{ validationErrors.services_devices_id[0] }}
              </div>
            </div>

            <!--Serial Number-->
            <div class="mb-3">
              <label for="serial_number" class="form-label fw-bold">Serial number</label>
              <input
                v-model="editedService.serial_number"
                type="text"
                class="form-control shadow-none bg-light"
                id="serial_number"
                readonly
              />
            </div>

            <!--Usage-->
            <div class="mb-3">
              <label for="usage" class="form-label fw-bold">Usage</label>
              <v-select
                v-model="editedService.usages_id"
                :options="usages"
                :reduce="(usage) => usage.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Usages"
                id="usage"
              />
            </div>

            <!--Damage-->
            <div class="mb-3">
              <label for="damage" class="form-label fw-bold">Damage</label>
              <textarea
                v-model="editedService.damage"
                class="form-control shadow-none"
                id="damage"
              />
            </div>

            <!--Repair-->
            <div class="mb-3">
              <label for="repair" class="form-label fw-bold">Repair</label>
              <textarea
                v-model="editedService.repair"
                class="form-control shadow-none"
                id="repair"
              />
            </div>

            <!--Technicians-->
            <div class="mb-3">
              <label for="technician" class="form-label fw-bold">Technicians</label>
              <v-select
                v-model="selectedTechnician"
                :options="props.technicians"
                :reduce="(technician) => technician.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Technicians"
                id="technician"
                @update:modelValue="handleTechnicianChange"
              />
              <div v-if="validationErrors.technicians_id" class="text-danger mt-1">
                {{ validationErrors.technicians_id[0] }}
              </div>
            </div>

            <!--No Spareparts-->
            <div class="mb-3">
              <label for="no_spareparts" class="form-label fw-bold">No Spareparts</label>
              <input
                v-model="editedService.no_spareparts"
                type="text"
                class="form-control shadow-none"
                id="no_spareparts"
                required
              />
            </div>

            <!--SN Cannibal-->
            <div class="mb-3">
              <label for="sn_kanibal" class="form-label fw-bold">SN Cannibal</label>
              <input
                v-model="editedService.sn_kanibal"
                type="text"
                class="form-control shadow-none"
                id="sn_kanibal"
                required
              />
            </div>

            <!--Date of Entry-->
            <div class="mb-3">
              <label class="fw-bold" for="date_in_services">Date of Entry</label>
              <VueDatePicker
                v-model="editedService.date_in_services"
                :enable-time-picker="false"
                :format="customDateFormat"
                :model-value="formatDateForPicker(editedService.date_in_services)"
                placeholder="Select Date"
              />
            </div>

            <!--Date Exit-->
            <div class="mb-3">
              <label class="fw-bold" for="date_out_services">Date Exit</label>
              <VueDatePicker
                v-model="editedService.date_out_services"
                :enable-time-picker="false"
                :format="customDateFormat"
                :model-value="formatDateForPicker(editedService.date_out_services)"
                placeholder="Select Date"
              />
            </div>

            <!--Note-->
            <div class="mb-3">
              <label for="note" class="form-label fw-bold">Note</label>
              <textarea v-model="editedService.note" class="form-control shadow-none" id="note" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-danger text-white" :disabled="!isDataChanged">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, reactive } from 'vue'
import { Modal } from 'bootstrap'
import vSelect from 'vue-select'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-select/dist/vue-select.css'
import { showToast } from '@/utilities/toast'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  service: {
    type: Object,
    default: () => ({}),
  },
  serviceDevice: {
    type: Array,
    default: () => [],
  },
  usages: {
    type: Array,
    default: () => [],
  },
  technicians: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update', 'close'])

const editModal = ref(null)
const isDataChanged = ref(false)
const initialService = ref(null)
const editedService = reactive({})
const changedFields = reactive({})
const validationErrors = reactive({})

// New refs for v-select components
const selectedDevice = ref(null)
const selectedTechnician = ref(null)

const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const formatDateForServer = (date) => {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

const handleDeviceChange = (value) => {
  editedService.services_devices_id = value
  validationErrors.services_devices_id = null
}

const handleTechnicianChange = (value) => {
  editedService.technicians_id = value
  validationErrors.technicians_id = null
}

const validateForm = () => {
  const errors = {}

  if (!editedService.services_devices_id) {
    errors.services_devices_id = ['Please select a device type']
  }

  if (!editedService.technicians_id) {
    errors.technicians_id = ['Please select a technician']
  }

  Object.assign(validationErrors, errors)
  return Object.keys(errors).length === 0
}

const editForm = async () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  if (!validateForm()) {
    showToast('Please fix the validation errors.', 'error')
    return
  }

  try {
    const formData = {
      ...editedService,
      services_devices_id: selectedDevice.value,
      technicians_id: selectedTechnician.value,
    }

    // Format dates
    if (formData.date_in_services) {
      formData.date_in_services = formatDateForServer(formData.date_in_services)
    }
    if (formData.date_out_services) {
      formData.date_out_services = formatDateForServer(formData.date_out_services)
    }

    await emit('update', formData)
    hideModal()
  } catch (error) {
    console.error('Error updating service:', error)
    showToast('Failed to update service.', 'error')
  }
}

const resetForm = () => {
  Object.keys(editedService).forEach((key) => delete editedService[key])
  Object.keys(changedFields).forEach((key) => delete changedFields[key])
  Object.keys(validationErrors).forEach((key) => delete validationErrors[key])
  selectedDevice.value = null
  selectedTechnician.value = null
  isDataChanged.value = false
}

const showModal = () => {
  editModal.value.show()
}

const closeModal = () => {
  resetForm()
  hideModal()
  emit('close')
}

const hideModal = () => {
  editModal.value.hide()
  resetForm()
}

watch(
  () => props.service,
  (newService) => {
    if (newService) {
      initialService.value = cloneDeep(newService)
      Object.assign(editedService, cloneDeep(newService))

      // Set the select values
      selectedDevice.value = newService.services_devices_id
      selectedTechnician.value = newService.technicians_id

      if (editedService.date_in_services) {
        editedService.date_in_services = formatDateForPicker(editedService.date_in_services)
      }
      if (editedService.date_out_services) {
        editedService.date_out_services = formatDateForPicker(editedService.date_out_services)
      }
    }
  },
  { immediate: true, deep: true },
)

watch(
  editedService,
  (newValue) => {
    if (initialService.value) {
      Object.keys(newValue).forEach((key) => {
        if (JSON.stringify(newValue[key]) !== JSON.stringify(initialService.value[key])) {
          changedFields[key] = true
        } else {
          delete changedFields[key]
        }
      })
      isDataChanged.value = Object.keys(changedFields).length > 0
    }
  },
  { deep: true },
)

onMounted(() => {
  editModal.value = new Modal(document.getElementById('editForm'))
})

defineExpose({
  showModal,
  hideModal,
})
</script>
<style scoped>
input:focus,
textarea:focus {
  border-color: #d22c36;
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
  border-radius: 0.25rem;
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

.v-select.vs--open .vs__dropdown-toggle {
  border-bottom-color: transparent;
}
</style>
