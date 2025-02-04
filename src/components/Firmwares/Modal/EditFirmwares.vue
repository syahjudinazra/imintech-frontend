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
            <div class="mb-3">
              <label for="firmwareDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="editedFirmware.firmwares_devices_id"
                :options="firmwaresDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="firmwareDevice"
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
            <div class="mb-3">
              <label for="version" class="form-label fw-bold">Version</label>
              <input
                v-model="editedFirmware.version"
                type="text"
                class="form-control shadow-none"
                id="version"
                required
              />
            </div>
            <div class="mb-3">
              <label for="android" class="form-label fw-bold">Android</label>
              <v-select
                v-model="editedFirmware.androids_id"
                :options="androids"
                :reduce="(android) => android.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Android"
                id="android"
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
            <div class="mb-3">
              <label for="flash" class="form-label fw-bold">Flash Link</label>
              <input
                v-model="editedFirmware.flash"
                type="text"
                class="form-control shadow-none"
                id="flash"
              />
            </div>
            <div class="mb-3">
              <label for="ota" class="form-label fw-bold">OTA Link</label>
              <input
                v-model="editedFirmware.ota"
                type="text"
                class="form-control shadow-none"
                id="ota"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-danger text-white" :disabled="loading">
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
import { showToast } from '@/utilities/toast'
import 'vue-select/dist/vue-select.css'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  firmware: {
    type: Object,
    default: () => ({}),
  },
  firmwaresDevice: {
    type: Array,
    default: () => [],
  },
  androids: {
    type: Array,
    default: () => [],
  },
  loading: {
    default: false,
  },
})

const emit = defineEmits(['update', 'close'])
const isDataChanged = ref(false)
const initialFirmware = ref(null)
const editedFirmware = reactive({})
const changedFields = reactive({})

watch(
  () => props.firmware,
  (newFirmware) => {
    if (newFirmware) {
      initialFirmware.value = cloneDeep(newFirmware)
      Object.assign(editedFirmware, cloneDeep(newFirmware))
    }
  },
  { immediate: true, deep: true },
)

watch(
  editedFirmware,
  (newValue) => {
    if (initialFirmware.value) {
      Object.keys(newValue).forEach((key) => {
        if (JSON.stringify(newValue[key]) !== JSON.stringify(initialFirmware.value[key])) {
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

let editModal

const editForm = () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  const updatedFirmware = { id: editedFirmware.id }
  Object.keys(changedFields).forEach((key) => {
    updatedFirmware[key] = editedFirmware[key]
  })

  // Ensure android field is included
  if (updatedFirmware.androids_id) {
    updatedFirmware.android = updatedFirmware.androids_id
  }

  emit('update', updatedFirmware)
  hideModal()
}

const closeModal = () => {
  hideModal()
  emit('close')
}

const showModal = () => {
  editModal.show()
}

const hideModal = () => {
  editModal.hide()
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  editModal = new Modal(document.getElementById('editForm'))
})
</script>
<style scoped>
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
