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
            <!--Date of Entry-->
            <div class="mb-3">
              <label class="fw-bold" for="date_loan">Date of Entry</label>
              <VueDatePicker
                v-model="editedLoan.date_loan"
                :enable-time-picker="false"
                :format="customDateFormat"
                :model-value="formatDateForPicker(editedLoan.date_loan)"
                placeholder="Select Date"
              />
            </div>

            <!--Serial Number-->
            <div class="mb-3">
              <label for="serial_number" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="editedLoan.serial_number"
                type="text"
                class="form-control shadow-none bg-light"
                id="serial_number"
                readonly
              />
            </div>

            <!--Device Type-->
            <div class="mb-3">
              <label for="loanDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="editedLoan.loan_devices_id"
                :options="loanDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="loanDevice"
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

            <!--RAM Section-->
            <div class="mb-3">
              <label for="rams" class="form-label fw-bold">RAM</label>
              <v-select
                v-model="editedLoan.rams_id"
                :options="rams"
                :reduce="(ram) => ram.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="rams"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--Android Section-->
            <div class="mb-3">
              <label for="androids" class="form-label fw-bold">Android</label>
              <v-select
                v-model="editedLoan.androids_id"
                :options="androids"
                :reduce="(android) => android.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="androids"
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

            <!--Customers Section-->
            <div class="mb-3">
              <label for="customers" class="form-label fw-bold">Customers</label>
              <input
                v-model="editedLoan.customers"
                type="text"
                class="form-control shadow-none"
                id="customers"
              />
            </div>

            <!--Address-->
            <div class="mb-3">
              <label for="address" class="form-label fw-bold">Address</label>
              <textarea
                v-model="editedLoan.address"
                class="form-control shadow-none"
                id="address"
              />
            </div>

            <!--Sales Section-->
            <div class="mb-3">
              <label for="sales" class="form-label fw-bold">Sales</label>
              <v-select
                v-model="editedLoan.sales_id"
                :options="sales"
                :reduce="(sales) => sales.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="sales"
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

            <!--Phone Number-->
            <div class="mb-3">
              <label for="phone_number" class="form-label fw-bold">Phone Number</label>
              <input
                v-model="editedLoan.phone_number"
                type="text"
                class="form-control shadow-none"
                id="phone_number"
              />
            </div>

            <!--Sender-->
            <div class="mb-3">
              <label for="sender" class="form-label fw-bold">Sender</label>
              <input
                v-model="editedLoan.sender"
                type="text"
                class="form-control shadow-none"
                id="sender"
              />
            </div>

            <!--Shipping Equipment-->
            <div class="mb-3">
              <label for="shipping_equipment" class="form-label fw-bold">Shipping Equipment</label>
              <textarea
                v-model="editedLoan.shipping_equipment"
                class="form-control shadow-none"
                id="shipping_equipment"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button
              type="submit"
              class="btn btn-danger text-white"
              :disabled="!isDataChanged || loading"
            >
              {{ loading ? 'Submitting...' : 'Submit' }}
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
  loan: {
    type: Object,
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
  sales: {
    type: Array,
    default: () => [],
  },
  loading: {
    default: () => [],
  },
})

const emit = defineEmits(['update', 'close'])

// Refs and reactive states
const editModal = ref(null)
const isDataChanged = ref(false)
const initialLoan = ref(null)
const editedLoan = reactive({})
const changedFields = reactive({})

// Date formatting
const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

// Watchers
watch(
  () => props.loan,
  (newLoan) => {
    if (newLoan) {
      initialLoan.value = cloneDeep(newLoan)
      Object.assign(editedLoan, cloneDeep(newLoan))
      if (editedLoan.date_loan) {
        editedLoan.date_loan = formatDateForPicker(editedLoan.date_loan)
      }
    }
  },
  { immediate: true, deep: true },
)

watch(
  editedLoan,
  (newValue) => {
    if (initialLoan.value) {
      Object.keys(newValue).forEach((key) => {
        if (JSON.stringify(newValue[key]) !== JSON.stringify(initialLoan.value[key])) {
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
    const updatedService = { id: editedLoan.id }
    Object.keys(changedFields).forEach((key) => {
      updatedService[key] = editedLoan[key]
    })

    if (updatedService.date_loan) {
      updatedService.date_loan = updatedService.date_loan.toISOString().split('T')[0]
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
  Object.keys(editedLoan).forEach((key) => delete editedLoan[key])
  isDataChanged.value = false
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  editModal.value = new Modal(document.getElementById('editForm'))
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
