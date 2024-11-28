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
            <!-- Status -->
            <div class="form-group mb-3">
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="d-flex gap-2">
                <div class="form-check">
                  <input
                    v-model="movedService.status"
                    class="form-check-input"
                    type="radio"
                    name="status"
                    id="statusPending"
                    value="Pending Customers"
                  />
                  <label class="form-check-label" for="statusPending"> Pending Customers </label>
                </div>
                <div class="form-check">
                  <input
                    v-model="movedService.status"
                    class="form-check-input"
                    type="radio"
                    name="status"
                    id="statusValidation"
                    value="Validation Customers"
                  />
                  <label class="form-check-label" for="statusValidation">
                    Validation Customers
                  </label>
                </div>
                <div class="form-check">
                  <input
                    v-model="movedService.status"
                    class="form-check-input"
                    type="radio"
                    name="status"
                    id="statusDone"
                    value="Done Customers"
                  />
                  <label class="form-check-label" for="statusDone"> Done Customers </label>
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
import { showToast } from '@/utilities/toast'
import { cloneDeep } from 'lodash-es'
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
const isDataChanged = ref(false)
const initialService = ref(null)
const movedService = reactive({})
const changedFields = reactive({})
let moveModal = null

// File upload refs
const imageInput = ref(null)
const documentInput = ref(null)
const imageFiles = ref([])
const documentFiles = ref([])
const imagePreviewUrls = ref([])

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const formatDateForServer = (date) => {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

const moveForm = async () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  const formData = new FormData()

  const formattedDate = formatDateForServer(movedService.date_out_services)

  Object.keys(changedFields).forEach((key) => {
    if (key !== 'images' && key !== 'documents') {
      if (key === 'date_out_services') {
        formData.append(key, formattedDate)
      } else {
        formData.append(key, movedService[key])
      }
    }
  })

  // Append files
  imageFiles.value.forEach((file) => {
    formData.append('images[]', file)
  })

  documentFiles.value.forEach((file) => {
    formData.append('documents[]', file)
  })

  // Add other required fields
  formData.append('technicians_id', movedService.technicians_id)
  formData.append('repair', movedService.repair || '')
  formData.append('no_spareparts', movedService.no_spareparts || '')
  formData.append('sn_kanibal', movedService.sn_kanibal || '')
  formData.append('date_out_services', formattedDate || '')
  formData.append('note', movedService.note || '')
  formData.append('status', movedService.status || '')

  emit('update', formData)
  hideModal()
}

// Reset form
const resetForm = () => {
  imageFiles.value = []
  documentFiles.value = []
  imagePreviewUrls.value = []
  if (imageInput.value) imageInput.value.value = ''
  if (documentInput.value) documentInput.value.value = ''
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
      Object.assign(movedService, cloneDeep(newService))
      if (movedService.date_out_services) {
        movedService.date_out_services = formatDateForPicker(movedService.date_out_services)
      }
    }
  },
  { immediate: true, deep: true },
)

watch(
  movedService,
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
input:focus,
textarea:focus {
  border-color: #d22c36;
}
</style>
