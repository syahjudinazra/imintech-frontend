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
            <!-- Returned Date -->
            <div class="mb-3">
              <label for="date_loan_back" class="form-label fw-bold">Returned Date</label>
              <VueDatePicker
                v-model="movedLoan.date_loan_back"
                :enable-time-picker="false"
                :format="customDateFormat"
                :model-value="formatDateForPicker(movedLoan.date_loan_back)"
                @update:model-value="handleDateChange"
                placeholder="Select Date"
              />
            </div>

            <!-- Recipient -->
            <div class="mb-3">
              <label for="recipient" class="form-label fw-bold">Recipient</label>
              <input
                v-model="movedLoan.recipient"
                type="text"
                class="form-control shadow-none"
                id="recipient"
                placeholder="Input recipient"
              />
            </div>

            <!-- Equipment Back -->
            <div class="mb-3">
              <label for="equipment_back" class="form-label fw-bold"> Equipment Back </label>
              <textarea
                v-model="movedLoan.equipment_back"
                class="form-control shadow-none"
                id="equipment_back"
                placeholder="Input equipment back"
              />
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
})

const emit = defineEmits(['update', 'close'])

// State
const isDataChanged = ref(false)
const initialLoan = ref(null)
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
  movedLoan.date_loan_back = newDate
  changedFields.date_loan_back = true
  isDataChanged.value = true
}

const moveForm = async () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  // Prepare payload with explicitly set status
  const payload = {
    date_loan_back: formatDateForServer(movedLoan.date_loan_back) || '',
    recipient: movedLoan.recipient || '',
    equipment_back: movedLoan.equipment_back || '',
    status: 'Returned',
  }

  emit('update', payload)
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
  () => props.loan,
  (newLoan) => {
    if (newLoan) {
      initialLoan.value = cloneDeep(newLoan)

      const loanClone = cloneDeep(newLoan)
      Object.assign(movedLoan, loanClone)

      if (movedLoan.date_loan_back) {
        movedLoan.date_loan_back = formatDateForPicker(movedLoan.date_loan_back)
      }
    }
  },
  { immediate: true, deep: true },
)

watch(
  movedLoan,
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
