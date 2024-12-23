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
          <div
            class="mb-3"
            v-if="
              (sparepartRequests && sparepartRequests.length > 0) ||
              (sparepartsDetails && sparepartsDetails.length > 0)
            "
          >
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

          <!--Repair-->
          <div class="mb-3">
            <label class="fw-bold" for="repair">Repair</label>
            <textarea
              :value="service?.repair"
              class="form-control shadow-none bg-light"
              id="repair"
              readonly
            ></textarea>
          </div>

          <!--Technicians-->
          <div class="mb-3">
            <label class="form-label fw-bold">Technicians</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.technicians_id"
              id="technicians_id"
              name="technicians_id"
              readonly
            />
          </div>

          <!--No Spareparts-->
          <div class="mb-3">
            <label class="form-label fw-bold">No Spareparts</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.no_spareparts"
              id="no_spareparts"
              name="no_spareparts"
              readonly
            />
          </div>

          <!--SN Cannibal-->
          <div class="mb-3">
            <label class="form-label fw-bold">SN Cannibal</label>
            <input
              class="form-control shadow-none bg-light"
              :value="service?.sn_kanibal"
              id="sn_kanibal"
              name="sn_kanibal"
              readonly
            />
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

          <!-- Date out -->
          <div class="mb-3">
            <label class="fw-bold">Date Exit</label>
            <VueDatePicker
              class="shadow-none bg-light"
              :model-value="formatDateForPicker(service?.date_out_services)"
              :enable-time-picker="false"
              :format="customDateFormat"
              id="date_out_services"
              name="date_out_services"
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

          <!-- Images Section -->
          <div class="mb-3" v-if="service?.images && parsedImages.length > 0">
            <label class="form-label fw-bold">Payment Images</label>
            <div class="d-flex flex-wrap gap-2">
              <div
                v-for="(imagePath, index) in parsedImages"
                :key="index"
                class="position-relative border rounded p-2"
              >
                <div class="text-center mb-2">
                  <i class="bi bi-file-image text-primary" style="font-size: 2rem"></i>
                </div>
                <div class="text-center">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="downloadFile(imagePath, `image-${index + 1}`)"
                    title="Download Image"
                  >
                    <i class="bi bi-download me-1"></i>
                    Image {{ index + 1 }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="mb-3" v-if="service?.documents && parsedDocuments.length > 0">
            <label class="form-label fw-bold">Invoice Documents</label>
            <div class="d-flex flex-wrap gap-2">
              <div
                v-for="(docPath, index) in parsedDocuments"
                :key="index"
                class="position-relative border rounded p-2"
              >
                <div class="text-center mb-2">
                  <i class="bi bi-file-pdf text-danger" style="font-size: 2rem"></i>
                </div>
                <div class="text-center">
                  <button
                    class="btn btn-sm btn-danger"
                    @click="downloadFile(docPath, `document-${index + 1}`)"
                    title="Download Document"
                  >
                    <i class="bi bi-download me-1"></i>
                    Document {{ index + 1 }}
                  </button>
                </div>
              </div>
            </div>
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
import { ref, defineProps, defineEmits, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  service: {
    type: Object,
    default: () => ({}),
  },
  serviceDevice: {
    type: Array,
    default: () => [],
  },
  sparepartRequests: {
    type: Array,
    default: () => [],
  },
  sparepartsDetails: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close'])
const viewModal = ref(null)

// Compute parsed images array from JSON string
const parsedImages = computed(() => {
  if (!props.service?.images) return []
  try {
    return typeof props.service.images === 'string'
      ? JSON.parse(props.service.images)
      : props.service.images
  } catch (e) {
    console.error('Error parsing images:', e)
    return []
  }
})

// Compute parsed documents array from JSON string
const parsedDocuments = computed(() => {
  if (!props.service?.documents) return []
  try {
    return typeof props.service.documents === 'string'
      ? JSON.parse(props.service.documents)
      : props.service.documents
  } catch (e) {
    console.error('Error parsing documents:', e)
    return []
  }
})

// Helper function to get file extension from path
const getFileExtension = (path) => {
  return path.split('.').pop().toLowerCase()
}

// Helper function to download file
const downloadFile = async (filePath, defaultName) => {
  try {
    const response = await fetch(filePath)
    const blob = await response.blob()
    const extension = getFileExtension(filePath)
    const fileName = `${defaultName}.${extension}`

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    window.URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Failed to download file. Please try again.')
  }
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

const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const formatSparepartNumbers = (requests) => {
  if (requests && requests.length > 0) {
    return requests.map((req) => req.no_spareparts).join(', ')
  }

  if (props.sparepartsDetails && props.sparepartsDetails.length > 0) {
    return props.sparepartsDetails.map((item) => `${item.no_spareparts}`).join(', ')
  }

  return 'No spareparts requested'
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

/* Image gallery styles */
.img-thumbnail {
  cursor: pointer;
  transition: transform 0.2s;
}

.img-thumbnail:hover {
  transform: scale(1.05);
}

/* Document styles */
.bi-file-earmark-pdf {
  font-size: 1.2rem;
}

a {
  color: #d22c36;
}

a:hover {
  color: #aa232b;
}
</style>
