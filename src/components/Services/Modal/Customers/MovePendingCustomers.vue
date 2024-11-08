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
                v-model="movedService.serial_number"
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
                v-model="movedService.customers"
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
                v-model="movedService.damage"
                class="form-control bg-light shadow-none"
                id="damage"
                readonly
              />
            </div>

            <!-- Repair -->
            <div class="mb-3">
              <label for="repair" class="form-label fw-bold"> Repair </label>
              <textarea
                v-model="movedService.repair"
                class="form-control shadow-none"
                id="repair"
                placeholder="Input Repair"
              />
            </div>

            <!-- Technician -->
            <div class="mb-3">
              <label for="technician" class="form-label fw-bold"> Technician </label>
              <v-select
                v-model="movedService.technicians_id"
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
              <label for="serviceDevice" class="form-label fw-bold"> No Spareparts </label>
              <v-select
                v-model="movedService.spareparts_id"
                :options="props.spareparts"
                :reduce="(sparepart) => sparepart.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select No Spareparts"
                id="spareparts"
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

            <!-- SN Cannibal -->
            <div class="mb-3">
              <label for="sn_kanibal" class="form-label fw-bold">SN Cannibal</label>
              <input
                v-model="movedService.sn_kanibal"
                type="text"
                class="form-control shadow-none"
                id="sn_kanibal"
                placeholder="Input SN Cannibal"
              />
            </div>

            <!-- Date Exit -->
            <div class="mb-3">
              <label for="date_out_services" class="form-label fw-bold"> Date exit </label>
              <VueDatePicker
                v-model="movedService.date_out_services"
                :enable-time-picker="false"
                id="date_out_services"
              />
            </div>

            <!-- Note -->
            <div class="mb-3">
              <label for="note" class="form-label fw-bold"> Note </label>
              <textarea v-model="movedService.note" class="form-control shadow-none" id="note" />
            </div>
            <!-- File Upload - Images -->
            <div class="mb-3">
              <label for="images" class="form-label fw-bold">Upload Payment</label>
              <input
                type="file"
                class="form-control shadow-none"
                id="images"
                multiple
                @change="handleImageUpload"
                accept="image/*"
                ref="imageInput"
              />
              <small class="text-secondary">Support file: PNG,JPG,JPEG. Max 2MB</small>
              <!-- Image Preview -->
              <div v-if="imagePreviewUrls.length" class="mt-2 d-flex flex-wrap gap-2">
                <div
                  v-for="(url, index) in imagePreviewUrls"
                  :key="index"
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
                    @click="removeImage(index)"
                  >
                    x
                  </button>
                </div>
              </div>
            </div>

            <!-- File Upload - Documents -->
            <div class="mb-3">
              <label for="documents" class="form-label fw-bold">Upload Invoice</label>
              <input
                type="file"
                class="form-control shadow-none"
                id="documents"
                multiple
                @change="handleDocumentUpload"
                accept=".pdf,.doc,.docx"
                ref="documentInput"
              />
              <small class="text-secondary">Support file: .Pdf Max 5MB</small>
              <!-- Document Preview -->
              <div v-if="documentFiles.length" class="mt-2">
                <div
                  v-for="(file, index) in documentFiles"
                  :key="index"
                  class="d-flex align-items-center gap-2 mb-2"
                >
                  <i class="bi bi-file-earmark-text"></i>
                  <span>{{ file.name }}</span>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeDocument(index)"
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
import { ref, watch, onMounted, reactive } from 'vue'
import { Modal } from 'bootstrap'
import vSelect from 'vue-select'
import VueDatePicker from '@vuepic/vue-datepicker'
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
  technicians: {
    type: Array,
    required: true,
    default: () => [],
  },
  spareparts: {
    type: Array,
    required: true,
    default: () => [],
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

// File handling methods
const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)

  // Validate file types and size
  const validFiles = files.filter((file) => {
    const isImage = file.type.startsWith('image/')
    const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit

    if (!isImage) {
      showToast('Please upload only image files.', 'error')
    }
    if (!isValidSize) {
      showToast('Image size should be less than 5MB.', 'error')
    }

    return isImage && isValidSize
  })

  // Create preview URLs and store files
  validFiles.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviewUrls.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })

  imageFiles.value = [...imageFiles.value, ...validFiles]
  movedService.images = imageFiles.value
  changedFields.images = true
  isDataChanged.value = true
}

const handleDocumentUpload = (event) => {
  const files = Array.from(event.target.files)

  // Validate file types and size
  const validFiles = files.filter((file) => {
    const validTypes = ['.pdf', '.doc', '.docx']
    const isValidType = validTypes.some((type) => file.name.toLowerCase().endsWith(type))
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

    if (!isValidType) {
      showToast('Please upload only PDF or Word documents.', 'error')
    }
    if (!isValidSize) {
      showToast('Document size should be less than 10MB.', 'error')
    }

    return isValidType && isValidSize
  })

  documentFiles.value = [...documentFiles.value, ...validFiles]
  movedService.documents = documentFiles.value
  changedFields.documents = true
  isDataChanged.value = true
}

const removeImage = (index) => {
  imageFiles.value.splice(index, 1)
  imagePreviewUrls.value.splice(index, 1)
  movedService.images = imageFiles.value
  if (imageFiles.value.length === 0) {
    delete changedFields.images
  }
  isDataChanged.value = Object.keys(changedFields).length > 0
}

const removeDocument = (index) => {
  documentFiles.value.splice(index, 1)
  movedService.documents = documentFiles.value
  if (documentFiles.value.length === 0) {
    delete changedFields.documents
  }
  isDataChanged.value = Object.keys(changedFields).length > 0
}

// Form submission
const moveForm = () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  // Create FormData for file upload
  const formData = new FormData()
  formData.append('id', movedService.id)

  // Append changed fields
  Object.keys(changedFields).forEach((key) => {
    if (key === 'images') {
      imageFiles.value.forEach((file) => {
        formData.append('images[]', file)
      })
    } else if (key === 'documents') {
      documentFiles.value.forEach((file) => {
        formData.append('documents[]', file)
      })
    } else {
      formData.append(key, movedService[key])
    }
  })

  emit('update', formData)
  hideModal()
}

// Reset file inputs when modal is closed
const closeModal = () => {
  imageFiles.value = []
  documentFiles.value = []
  imagePreviewUrls.value = []
  if (imageInput.value) imageInput.value.value = ''
  if (documentInput.value) documentInput.value.value = ''
  hideModal()
  emit('close')
}

const showModal = () => {
  moveModal?.show()
}

const hideModal = () => {
  moveModal?.hide()
}

// Watchers
watch(
  () => props.service,
  (newService) => {
    if (newService) {
      initialService.value = cloneDeep(newService)
      Object.assign(movedService, cloneDeep(newService))
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
