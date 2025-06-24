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
          <h5 class="modal-title" id="moveForm_label">Move Status</h5>
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          />
        </div>

        <div class="modal-body">
          <form @submit.prevent="moveForm">
            <div class="tab-content" id="moveFormTabsContent">
              <div class="form-group">
                <!-- Copy Content -->
                <div class="d-flex justify-content-between mb-2">
                  <label class="form-label fw-bold">Copy Data</label>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm shadow-none"
                    @click="copyText"
                  >
                    Copy
                  </button>
                </div>
                <div class="copy-content">
                  <pre ref="copyContentRef" class="border p-2 bg-light">{{
                    formattedCopyContent
                  }}</pre>
                </div>
                <!-- Status Form -->
                <label class="form-label fw-bold">Status</label>
                <div class="d-flex">
                  <div class="form-check me-2">
                    <input
                      v-model="status"
                      class="form-check-input"
                      type="radio"
                      name="status"
                      id="statusQueue"
                      value="Queue Stocks"
                    />
                    <label class="form-check-label" for="statusQueue"> Queue </label>
                  </div>
                  <div class="form-check me-2">
                    <input
                      v-model="status"
                      class="form-check-input"
                      type="radio"
                      name="status"
                      id="statusPending"
                      value="Pending Stocks"
                    />
                    <label class="form-check-label" for="statusPending"> Pending </label>
                  </div>
                  <div class="form-check me-2">
                    <input
                      v-model="status"
                      class="form-check-input"
                      type="radio"
                      name="status"
                      id="statusValidation"
                      value="Validation Stocks"
                    />
                    <label class="form-check-label" for="statusValidation"> Validation </label>
                  </div>
                  <div class="form-check me-2">
                    <input
                      v-model="status"
                      class="form-check-input"
                      type="radio"
                      name="status"
                      id="statusDelivery"
                      value="Delivery Stocks"
                    />
                    <label class="form-check-label" for="statusDelivery"> Delivery </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="status"
                      class="form-check-input"
                      type="radio"
                      name="status"
                      id="statusDone"
                      value="Done Stocks"
                    />
                    <label class="form-check-label" for="statusDone"> Done </label>
                  </div>
                </div>
              </div>
              <!-- Date Exit -->
              <div class="mb-3" hidden>
                <label for="date_out_services" class="form-label fw-bold">Date exit</label>
                <VueDatePicker
                  v-model="movedService.date_out_services"
                  :enable-time-picker="false"
                  :format="customDateFormat"
                  @update:model-value="handleDateChange"
                  readonly
                />
              </div>
            </div>

            <div class="modal-footer mt-3">
              <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
              <button
                type="submit"
                class="btn btn-danger text-white"
                :disabled="!status || status === initialStatus"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  computed,
  reactive,
  defineProps,
  defineEmits,
  defineExpose,
} from 'vue'
import { Modal } from 'bootstrap'
import { showToast } from '@/utilities/toast'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  service: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['update', 'close'])

// State
const status = ref('')
const movedService = reactive({
  date_out_services: new Date(),
})

// State
const isDataChanged = ref(false)
const changedFields = reactive({})
const initialStatus = ref('')
const copyContentRef = ref(null)
let moveModal = null

// Date handling
const customDateFormat = 'dd/MM/yyyy'
const handleDateChange = (newDate) => {
  movedService.date_out_services = newDate
  changedFields.date_out_services = true
  isDataChanged.value = true
}

// Computed property for formatted copy content
const formattedCopyContent = computed(() =>
  `
${props.service.customers}
${props.service.services_devices_id}
${props.service.serial_number}
Status : ${props.service.status}

Kerusakan :
${props.service.damage}

Perbaikan :
${props.service.repair}

No Sparepart :
${props.service.no_spareparts}

Teknisi :
${props.service.technicians_id}

Catatan :
${props.service.note}
`.trim(),
)

// Modal handlers
const showModal = () => {
  moveModal?.show()
}

const hideModal = () => {
  moveModal?.hide()
}

const closeModal = () => {
  status.value = initialStatus.value
  hideModal()
  emit('close')
}

const moveForm = async () => {
  if (!status.value || status.value === initialStatus.value) {
    showToast('No changes detected.', 'error')
    return
  }

  const formData = new FormData()
  formData.append('status', status.value)

  if (movedService.date_out_services) {
    formData.append('date_out_services', movedService.date_out_services.toISOString().split('T')[0])
  }

  emit('update', formData)
  hideModal()
}

const copyText = () => {
  if (!copyContentRef.value) return

  try {
    const textToCopy = copyContentRef.value.textContent || copyContentRef.value.innerText

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showToast('Text copied to clipboard.', 'success')
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
        showToast('Failed to copy text.', 'error')
      })
  } catch (error) {
    showToast('Failed to copy text.', 'error')
  }
}

// Watch for service prop changes
watch(
  () => props.service,
  (newService) => {
    if (newService) {
      status.value = newService.status || ''
      initialStatus.value = newService.status || ''

      // Set date from service or default to today
      if (newService.date_out_services) {
        movedService.date_out_services = new Date(newService.date_out_services)
      } else {
        movedService.date_out_services = new Date()
      }
    }
  },
  { immediate: true },
)

// Lifecycle
onMounted(() => {
  moveModal = new Modal(document.getElementById('moveForm'))
  if (!movedService.date_out_services) {
    movedService.date_out_services = new Date()
  }
})

// Expose methods
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
</style>
