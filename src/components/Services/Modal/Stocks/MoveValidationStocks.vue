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
          <!-- Tabs Navigation -->
          <ul class="nav nav-tabs mb-3" id="moveFormTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="status-tab"
                data-bs-toggle="tab"
                data-bs-target="#status-content"
                type="button"
                role="tab"
              >
                Status
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="copy-tab"
                data-bs-toggle="tab"
                data-bs-target="#copy-content"
                type="button"
                role="tab"
              >
                Copy Data
              </button>
            </li>
          </ul>

          <form @submit.prevent="moveForm">
            <!-- Tab Content -->
            <div class="tab-content" id="moveFormTabsContent">
              <!-- Status Tab -->
              <div class="tab-pane fade show active" id="status-content" role="tabpanel">
                <div class="form-group">
                  <label class="form-label fw-bold">Status</label>
                  <div class="d-flex">
                    <div class="form-check me-2">
                      <input
                        v-model="status"
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id="statusPending"
                        value="Pending Stocks"
                      />
                      <label class="form-check-label" for="statusPending"> Pending Stocks </label>
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
                      <label class="form-check-label" for="statusValidation">
                        Validation Stocks
                      </label>
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
                      <label class="form-check-label" for="statusDone"> Done Stocks </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Copy Data Tab -->
              <div class="tab-pane fade" id="copy-content" role="tabpanel">
                <div class="form-group">
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
                </div>
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
import { ref, watch, onMounted, computed, defineProps, defineEmits, defineExpose } from 'vue'
import { Modal } from 'bootstrap'
import { showToast } from '@/utilities/toast'

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
const initialStatus = ref('')
const copyContentRef = ref(null)
let moveModal = null

// Computed property for formatted copy content
const formattedCopyContent = computed(() =>
  `
${props.service.customers}
${props.service.services_devices_id}
${props.service.serial_number}
*Status :* ${props.service.status}

*Kerusakan :*
${props.service.damage}

*Perbaikan :*
${props.service.repair}

*No Sparepart :*
${props.service.no_spareparts}

*Teknisi :*
${props.service.technicians_id}

*Catatan :*
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
    console.error('Failed to copy text: ', error)
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
    }
  },
  { immediate: true },
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

.nav-tabs .nav-link.active {
  color: #d22c36;
  border-color: #d22c36 #d22c36 #fff;
}

.nav-tabs .nav-link:hover {
  color: #d22c36;
  border-color: #d22c36;
}
</style>
