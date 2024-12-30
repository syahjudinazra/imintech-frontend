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

            <!--Completion Date-->
            <div class="mb-3">
              <label class="fw-bold" for="date_out_services">Completion Date</label>
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

            <!-- Images Section -->
            <div class="mb-3">
              <label for="images" class="form-label fw-bold">Upload Payment</label>
              <input
                type="file"
                class="form-control shadow-none"
                id="images"
                multiple
                @change="handleImageUpload"
                accept="image/jpeg,image/png,image/jpg"
                ref="imageInput"
              />
              <small class="text-secondary">Support file: PNG,JPG,JPEG. Max 2MB</small>

              <!-- Existing Images Preview -->
              <div v-if="editedService.images" class="mt-2 d-flex flex-wrap gap-2">
                <div
                  v-for="(image, index) in existingImages"
                  :key="'existing-' + index"
                  class="position-relative"
                >
                  <img
                    :src="`${image}`"
                    class="img-thumbnail"
                    style="height: 100px; width: 100px; object-fit: cover"
                  />
                  <button
                    type="button"
                    class="btn btn-danger btn-sm position-absolute top-0 end-0"
                    @click="removeExistingImage(index)"
                  >
                    x
                  </button>
                </div>
              </div>

              <!-- New Images Preview -->
              <div v-if="imagePreviewUrls.length" class="mt-2 d-flex flex-wrap gap-2">
                <div
                  v-for="(url, index) in imagePreviewUrls"
                  :key="'new-' + index"
                  class="position-relative"
                >
                  <img
                    :src="url"
                    class="img-thumbnail"
                    style="height: 100px; width: 100px; object-fit: cover"
                  />
                  <button
                    type="button"
                    class="btn btn-danger btn-sm position-absolute top-0 end-0"
                    @click="removeNewImage(index)"
                  >
                    x
                  </button>
                </div>
              </div>
            </div>

            <!-- Documents Section -->
            <div class="mb-3">
              <label for="documents" class="form-label fw-bold">Upload Invoice</label>
              <input
                type="file"
                class="form-control shadow-none"
                id="documents"
                multiple
                @change="handleDocumentUpload"
                accept="application/pdf"
                ref="documentInput"
              />
              <small class="text-secondary">Support file: .Pdf Max 5MB</small>

              <!-- Existing Documents Preview -->
              <div v-if="editedService.documents" class="mt-2">
                <div
                  v-for="(doc, index) in existingDocuments"
                  :key="'existing-doc-' + index"
                  class="d-flex align-items-center gap-2 mb-2"
                >
                  <i class="bi bi-file-earmark-pdf"></i>
                  <span>{{ getFileName(doc) }}</span>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeExistingDocument(index)"
                  >
                    x
                  </button>
                </div>
              </div>

              <!-- New Documents Preview -->
              <div v-if="documentFiles.length" class="mt-2">
                <div
                  v-for="(file, index) in documentFiles"
                  :key="'new-doc-' + index"
                  class="d-flex align-items-center gap-2 mb-2"
                >
                  <i class="bi bi-file-earmark-pdf"></i>
                  <span>{{ file.name }}</span>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeNewDocument(index)"
                  >
                    x
                  </button>
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
import { ref, watch, defineProps, defineEmits, onMounted, reactive, computed } from 'vue'
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

// File upload refs
const imageInput = ref(null)
const documentInput = ref(null)
const imageFiles = ref([])
const documentFiles = ref([])
const imagePreviewUrls = ref([])

// File validation
const validateImageFile = (file) => {
  const maxSize = 2 * 1024 * 1024 // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  if (!allowedTypes.includes(file.type)) {
    showToast(`File ${file.name} must be a JPEG, PNG, or JPG image.`, 'error')
    return false
  }

  if (file.size > maxSize) {
    showToast(`File ${file.name} exceeds 2MB limit.`, 'error')
    return false
  }

  return true
}

const validatePDFFile = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (file.type !== 'application/pdf') {
    showToast(`File ${file.name} must be a PDF document.`, 'error')
    return false
  }

  if (file.size > maxSize) {
    showToast(`File ${file.name} exceeds 5MB limit.`, 'error')
    return false
  }

  return true
}

// Date formatting
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

// File handling methods
const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  const validFiles = files.filter(validateImageFile)

  // Reset existing files and previews
  imageFiles.value = []
  imagePreviewUrls.value = []

  validFiles.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviewUrls.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })

  imageFiles.value = validFiles
  changedFields.images = true
  isDataChanged.value = true
}

const handleDocumentUpload = (event) => {
  const files = Array.from(event.target.files)
  const validFiles = files.filter(validatePDFFile)

  // Reset existing files
  documentFiles.value = []

  documentFiles.value = validFiles
  changedFields.documents = true
  isDataChanged.value = true
}

const existingImages = computed(() => {
  if (!editedService.images) return []
  return typeof editedService.images === 'string'
    ? JSON.parse(editedService.images)
    : editedService.images
})

const existingDocuments = computed(() => {
  if (!editedService.documents) return []
  return typeof editedService.documents === 'string'
    ? JSON.parse(editedService.documents)
    : editedService.documents
})

// Add these methods
const removeExistingImage = (index) => {
  const images = [...existingImages.value]
  images.splice(index, 1)
  editedService.images = JSON.stringify(images)
  changedFields.images = true
  isDataChanged.value = true
}

const removeExistingDocument = (index) => {
  const documents = [...existingDocuments.value]
  documents.splice(index, 1)
  editedService.documents = JSON.stringify(documents)
  changedFields.documents = true
  isDataChanged.value = true
}

const removeNewImage = (index) => {
  imageFiles.value.splice(index, 1)
  imagePreviewUrls.value.splice(index, 1)
  changedFields.images = true
  isDataChanged.value = true
}

const removeNewDocument = (index) => {
  documentFiles.value.splice(index, 1)
  changedFields.documents = true
  isDataChanged.value = true
}

const getFileName = (path) => {
  return path.split('/').pop()
}

const editForm = async () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  try {
    const formData = new FormData()

    // Add all fields from editedService that have changed
    Object.keys(editedService).forEach((key) => {
      if (key === 'images' || key === 'documents') {
        // Handle existing files
        if (editedService[key]) {
          formData.append(`existing_${key}`, editedService[key])
        }
      } else if (key === 'date_in_services' || key === 'date_out_services') {
        formData.append(key, formatDateForServer(editedService[key]))
      } else {
        formData.append(key, editedService[key])
      }
    })

    // Add new files
    if (imageFiles.value.length > 0) {
      imageFiles.value.forEach((file) => {
        formData.append('images[]', file)
      })
    }

    if (documentFiles.value.length > 0) {
      documentFiles.value.forEach((file) => {
        formData.append('documents[]', file)
      })
    }

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    await emit('update', formData)
    hideModal()
  } catch (error) {
    console.error('Error updating service:', error)
    showToast('Failed to update service.', 'error')
  }
}

// Reset form
const resetForm = () => {
  imageFiles.value = []
  documentFiles.value = []
  imagePreviewUrls.value = []
  if (imageInput.value) imageInput.value.value = ''
  if (documentInput.value) documentInput.value.value = ''
  Object.keys(editedService).forEach((key) => delete editedService[key])
  Object.keys(changedFields).forEach((key) => delete changedFields[key])
  isDataChanged.value = false
}

// Modal functions
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
