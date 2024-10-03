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
              />
            </div>
            <div class="mb-3">
              <label for="android" class="form-label fw-bold">Android</label>
              <select
                v-model="editedFirmware.androids_id"
                class="form-control shadow-none"
                id="android"
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
  firmware: Object,
  firmwaresDevice: Array,
  androids: Array,
})

const emit = defineEmits(['update', 'close'])

const editedFirmware = ref({
  firmwares_devices_id: '',
  version: '',
  androids_id: '',
  flash: '',
  ota: '',
})

// Watch for changes in the firmware prop and update the editedFirmware
watch(
  () => props.firmware,
  (newFirmware) => {
    if (newFirmware) {
      // Shallow copy to avoid reactivity issues
      editedFirmware.value = { ...newFirmware }
    }
  },
  { immediate: true, deep: true },
)

let editModal

const editForm = () => {
  emit('update', editedFirmware.value) // Emit updated firmware data
  hideModal() // Close the modal after submitting the form
}

const closeModal = () => {
  hideModal() // Close the modal
  emit('close') // Emit close event
}

const showModal = () => {
  editModal.show() // Show the modal
}

const hideModal = () => {
  editModal.hide() // Hide the modal
}

defineExpose({
  showModal, // Expose showModal method to be used externally
  hideModal, // Expose hideModal method to be used externally
})

// Initialize Bootstrap modal on mount
onMounted(() => {
  editModal = new Modal(document.getElementById('editForm'))
})
</script>
