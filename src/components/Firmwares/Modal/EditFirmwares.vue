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
              <label for="tipe" class="form-label fw-bold">Tipe Device</label>
              <select
                v-model="editedFirmware.firmwares_devices_id"
                class="form-control shadow-none"
                id="tipe"
                required
              >
                <option value="" disabled>Select Device Type</option>
                <option v-for="device in firmwaresDevice" :key="device.id" :value="device.id">
                  {{ device.name }}
                </option>
              </select>
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
              <select
                v-model="editedFirmware.androids_id"
                class="form-control shadow-none"
                id="android"
                required
              >
                <option value="" disabled>Select Android</option>
                <option v-for="android in androids" :key="android.id" :value="android.id">
                  {{ android.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="flash" class="form-label fw-bold">Flash Link</label>
              <input
                v-model="editedFirmware.flash"
                type="text"
                class="form-control shadow-none"
                id="flash"
                required
              />
            </div>
            <div class="mb-3">
              <label for="ota" class="form-label fw-bold">OTA Link</label>
              <input
                v-model="editedFirmware.ota"
                type="text"
                class="form-control shadow-none"
                id="ota"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import { Modal } from 'bootstrap'

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
})

const emit = defineEmits(['update', 'close'])

const editedFirmware = ref({
  firmwares_devices_id: '',
  version: '',
  androids_id: '',
  flash: '',
  ota: '',
})

watch(
  () => props.firmware,
  (newFirmware) => {
    if (newFirmware) {
      editedFirmware.value = { ...newFirmware }
    }
  },
  { immediate: true, deep: true },
)

let editModal

const editForm = () => {
  emit('update', editedFirmware.value)
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
