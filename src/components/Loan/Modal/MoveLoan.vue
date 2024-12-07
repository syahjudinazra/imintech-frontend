<template>
  <div
    class="modal fade"
    id="moveForm"
    tabindex="-1"
    aria-labelledby="moveForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="moveForm_label">Move Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal" />
        </div>
        <form @submit.prevent="moveForm">
          <div class="modal-body">
            <!-- Serial Number -->
            <div class="mb-3">
              <label for="serial_number" class="form-label fw-bold"> Serial number </label>
              <input
                v-model="movedLoan.serial_number"
                type="text"
                class="form-control bg-light shadow-none"
                id="serial_number"
                readonly
              />
            </div>

            <!-- Customers -->
            <div class="mb-3">
              <label for="customers" class="form-label fw-bold">Customers</label>
              <input
                v-model="movedLoan.customers"
                type="text"
                class="form-control bg-light shadow-none"
                id="customers"
                readonly
              />
            </div>

            <!-- Damage -->
            <div class="mb-3">
              <label for="damage" class="form-label fw-bold"> Damage </label>
              <textarea
                v-model="movedLoan.damage"
                class="form-control bg-light shadow-none"
                id="damage"
                readonly
              />
            </div>

            <!-- Repair -->
            <div class="mb-3">
              <label for="repair" class="form-label fw-bold"> Repair </label>
              <textarea
                v-model="movedLoan.repair"
                class="form-control shadow-none"
                id="repair"
                placeholder="Input Repair"
              />
            </div>

            <!-- Technician -->
            <div class="mb-3">
              <label for="technician" class="form-label fw-bold"> Technician </label>
              <v-select
                v-model="movedLoan.technicians_id"
                :options="props.technicians"
                :reduce="(technician) => technician.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Technician"
                id="technician"
                required
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!-- No Spareparts -->
            <div class="mb-3">
              <label for="no_spareparts" class="form-label fw-bold">No Spareparts</label>
              <input
                v-model="movedLoan.no_spareparts"
                type="text"
                class="form-control shadow-none"
                id="no_spareparts"
                placeholder="Input No Spareparts"
              />
            </div>

            <!-- SN Cannibal -->
            <div class="mb-3">
              <label for="sn_kanibal" class="form-label fw-bold">SN Cannibal</label>
              <input
                v-model="movedLoan.sn_kanibal"
                type="text"
                class="form-control shadow-none"
                id="sn_kanibal"
                placeholder="Input SN Cannibal"
              />
            </div>

            <!-- Date Exit -->
            <div class="mb-3">
              <label for="date_out_services" class="form-label fw-bold">Date exit</label>
              <VueDatePicker
                v-model="movedLoan.date_out_services"
                :enable-time-picker="false"
                :format="customDateFormat"
                :model-value="formatDateForPicker(movedLoan.date_out_services)"
                @update:model-value="handleDateChange"
                placeholder="Select Date"
              />
            </div>

            <!-- Note -->
            <div class="mb-3">
              <label for="note" class="form-label fw-bold"> Note </label>
              <textarea v-model="movedLoan.note" class="form-control shadow-none" id="note" />
            </div>

            <!-- Status -->
            <div class="form-group mb-3" hidden>
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="d-flex gap-2">
                <div class="form-check">
                  <input
                    v-model="movedLoan.status"
                    class="form-check-input"
                    type="radio"
                    name="status"
                    id="statusValidation"
                    value="Validation Stocks"
                  />
                  <label class="form-check-label" for="statusValidation"> Validation Stocks </label>
                </div>
              </div>
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
import { ref, watch, onMounted, reactive } from 'vue'
import { Modal } from 'bootstrap'
import vSelect from 'vue-select'
import VueDatePicker from '@vuepic/vue-datepicker'
import { showToast } from '@/utilities/toast'
import { cloneDeep } from 'lodash-es'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  loan: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  loanDevice: {
    type: Array,
    default: () => [],
  },
  rams: {
    type: Array,
    default: () => [],
  },
  androids: {
    type: Array,
    default: () => [],
  },
  customers: {
    type: Array,
    default: () => [],
  },
  sales: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update', 'close'])

// State
const isDataChanged = ref(false)
const initialService = ref(null)
const movedLoan = reactive({})
const changedFields = reactive({})
let moveModal = null

// Date handling
const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const formatDateForServer = (date) => {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().split('T')[0] // Returns YYYY-MM-DD format
}

const handleDateChange = (newDate) => {
  movedLoan.date_out_services = newDate
  changedFields.date_out_services = true
  isDataChanged.value = true
}

const moveForm = async () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  const formData = new FormData()

  // Format date before sending to server
  const formattedDate = formatDateForServer(movedLoan.date_out_services)

  // Append basic form fields
  Object.keys(changedFields).forEach((key) => {
    if (key !== 'images' && key !== 'documents') {
      if (key === 'date_out_services') {
        formData.append(key, formattedDate)
      } else {
        formData.append(key, movedLoan[key])
      }
    }
  })

  // Add other required fields
  formData.append('technicians_id', movedLoan.technicians_id)
  formData.append('repair', movedLoan.repair || '')
  formData.append('no_spareparts', movedLoan.no_spareparts || '')
  formData.append('sn_kanibal', movedLoan.sn_kanibal || '')
  formData.append('date_out_services', formattedDate || '')
  formData.append('note', movedLoan.note || '')
  formData.append('status', movedLoan.status || '')

  emit('update', formData)
  hideModal()
}

// Reset form
const resetForm = () => {
  Object.keys(changedFields).forEach((key) => delete changedFields[key])
  isDataChanged.value = false
}

// Modal handlers
const showModal = () => {
  moveModal?.show()
}

const hideModal = () => {
  resetForm()
  moveModal?.hide()
}

const closeModal = () => {
  resetForm()
  hideModal()
  emit('close')
}

// Watchers
watch(
  () => props.service,
  (newService) => {
    if (newService) {
      initialService.value = cloneDeep(newService)

      // Clone the service and explicitly set status to 'Validation Stocks'
      const serviceClone = cloneDeep(newService)
      Object.assign(movedLoan, serviceClone)

      // Always set status to 'Validation Stocks'
      movedLoan.status = 'Validation Stocks'

      if (movedLoan.date_out_services) {
        movedLoan.date_out_services = formatDateForPicker(movedLoan.date_out_services)
      }
    }
  },
  { immediate: true, deep: true },
)

watch(
  movedLoan,
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

// Lifecycle
onMounted(() => {
  moveModal = new Modal(document.getElementById('moveForm'))
})

// Expose methods
defineExpose({
  showModal,
  hideModal,
})
</script>

<style scoped>
input:focus {
  border-color: #d22c36;
}

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
