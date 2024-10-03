<template>
  <div class="modal fade" id="deleteForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Firmware</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this firmware?</p>
          <p v-if="internalFirmware">
            <strong>Version:</strong> {{ internalFirmware.version }}<br />
            <strong>Device Type:</strong> {{ internalFirmware.firmwares_devices_id }}<br />
            <strong>Android Version:</strong> {{ internalFirmware.androids_id }}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { defineEmits } from 'vue'

const emit = defineEmits(['delete', 'close'])

let deleteModal
const internalFirmware = ref(null)

const confirmDelete = () => {
  if (internalFirmware.value) {
    emit('delete', internalFirmware.value.id)
  } else {
    console.error('No firmware selected for deletion')
  }
}

const closeModal = () => {
  emit('close')
}

const showModal = (firmware) => {
  internalFirmware.value = firmware
  deleteModal.show()
}

const hideModal = () => {
  deleteModal.hide()
  internalFirmware.value = null
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  deleteModal = new Modal(document.getElementById('deleteForm'))
})
</script>
