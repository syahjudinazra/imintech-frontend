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

// Refs and reactive states
const editModal = ref(null)
const isDataChanged = ref(false)
const initialService = ref(null)
const editedService = reactive({})
const changedFields = reactive({})

// Device completeness items
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

// Parse existing completeness data and check appropriate boxes
const parseCompletenessData = (completenessString) => {
  if (!completenessString) return

  // Reset all checkboxes first
  deviceCompletenessItems.value.forEach((item) => (item.checked = false))

  // Split the completeness string by commas and trim each item
  const items = completenessString.split(',').map((item) => item.trim())

  // Check boxes that match items in the string
  deviceCompletenessItems.value.forEach((item) => {
    if (items.includes(item.label)) {
      item.checked = true
    }
  })

  // Update the selected completeness value
  selectedCompleteness.value = completenessString
}

// Update the selected completeness with the labels of checked items
const updateCompletenessData = () => {
  // Get all checked item labels and join them with commas
  const checkedLabels = deviceCompletenessItems.value
    .filter((item) => item.checked)
    .map((item) => item.label)
    .join(', ')

  // Store the comma-separated string
  selectedCompleteness.value = checkedLabels

  // Update the completeness field
  editedService.completeness = selectedCompleteness.value

  // Mark field as changed
  changedFields.completeness = true
}

// Date formatting
const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

// Watchers
watch(
  () => props.service,
  (newService) => {
    if (newService) {
      initialService.value = cloneDeep(newService)
      Object.assign(editedService, cloneDeep(newService))
      if (editedService.date_in_services) {
        editedService.date_in_services = formatDateForPicker(editedService.date_in_services)
      }
      // Parse the completeness data when the service changes
      parseCompletenessData(newService.completeness)
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

// Form submission
const editForm = () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  try {
    const updatedService = { id: editedService.id }
    Object.keys(changedFields).forEach((key) => {
      updatedService[key] = editedService[key]
    })

    if (updatedService.date_in_services) {
      updatedService.date_in_services = updatedService.date_in_services.toISOString().split('T')[0]
    }

    if (updatedService.usages_id) {
      updatedService.usage = updatedService.usages_id
    }

    emit('update', updatedService)
    hideModal()
  } catch (error) {
    console.error('Error updating service:', error)
    showToast('Failed to update service.', 'error')
  }
}

// Modal functions
const showModal = () => {
  editModal.value.show()
}

const closeModal = () => {
  hideModal()
  emit('close')
}

const hideModal = () => {
  editModal.value.hide()
  Object.keys(editedService).forEach((key) => delete editedService[key])
  isDataChanged.value = false
  // Reset completeness items
  deviceCompletenessItems.value.forEach((item) => (item.checked = false))
  selectedCompleteness.value = ''
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  editModal.value = new Modal(document.getElementById('editForm'))
})
</script>

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

            <!--PIC-->
            <div class="mb-3">
              <label for="pic" class="form-label fw-bold">PIC</label>
              <input
                v-model="editedService.pic"
                type="text"
                class="form-control shadow-none"
                id="pic"
              />
            </div>

            <!--Contact-->
            <div class="mb-3">
              <label for="contact" class="form-label fw-bold">Contact</label>
              <input
                v-model="editedService.contact"
                type="text"
                class="form-control shadow-none"
                id="contact"
              />
            </div>

            <!--Device Type-->
            <div class="mb-3">
              <label for="serviceDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="editedService.services_devices_id"
                :options="serviceDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="serviceDevice"
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
                v-model="editedService.technicians_id"
                :options="technicians"
                :reduce="(technician) => technician.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Technicians"
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

            <!--Device Completeness Section-->
            <div class="mb-3">
              <label class="form-label fw-bold" for="completeness">Device Completeness</label>
              <div v-for="item in deviceCompletenessItems" :key="item.id" class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'edit_' + item.id"
                  v-model="item.checked"
                  @change="updateCompletenessData"
                />
                <label class="form-check-label" :for="'edit_' + item.id">{{ item.label }}</label>
              </div>
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
