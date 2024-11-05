<template>
  <div class="modal fade" id="deleteForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete data</h5>
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
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { defineEmits } from 'vue'

const emit = defineEmits(['delete', 'close'])

let deleteModal
const internalStock = ref(null)

const confirmDelete = () => {
  if (internalStock.value) {
    emit('delete', internalStock.value.id)
  } else {
    console.error('No stock selected for deletion')
  }
}

const closeModal = () => {
  emit('close')
}

const showModal = (stock) => {
  internalStock.value = stock
  deleteModal.show()
}

const hideModal = () => {
  deleteModal.hide()
  internalStock.value = null
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  deleteModal = new Modal(document.getElementById('deleteForm'))
})
</script>
