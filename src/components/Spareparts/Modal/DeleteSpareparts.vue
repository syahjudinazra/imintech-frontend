<template>
  <div class="modal fade" id="deleteForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Spareparts</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this spareparts?</p>
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
const internalSparepart = ref(null)

const confirmDelete = () => {
  if (internalSparepart.value) {
    emit('delete', internalSparepart.value.id)
  } else {
    console.error('No spareparts selected for deletion')
  }
}

const closeModal = () => {
  emit('close')
}

const showModal = (sparepart) => {
  internalSparepart.value = sparepart
  deleteModal.show()
}

const hideModal = () => {
  deleteModal.hide()
  internalSparepart.value = null
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  deleteModal = new Modal(document.getElementById('deleteForm'))
})
</script>
