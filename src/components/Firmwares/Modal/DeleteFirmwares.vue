<template>
  <div class="modal fade" id="deleteForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this data?</p>
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
import { onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { defineEmits } from 'vue'

const emit = defineEmits(['delete', 'close'])

let deleteModal

const confirmDelete = () => {
  emit('delete')
}

const closeModal = () => {
  emit('close')
}

const showModal = () => {
  deleteModal.show()
}

const hideModal = () => {
  deleteModal.hide()
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  deleteModal = new Modal(document.getElementById('deleteForm'))
})
</script>
