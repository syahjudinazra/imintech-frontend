<template>
  <div class="modal fade" id="deleteModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="handleClose"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this data?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleClose">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="handleDelete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'

const emit = defineEmits(['delete', 'close'])
const modal = ref(null)

const handleDelete = () => {
  emit('delete')
  // Let the parent component handle the modal closing
}

const handleClose = () => {
  emit('close')
}

const showModal = () => {
  if (modal.value) {
    modal.value.show()
  }
}

const hideModal = () => {
  if (modal.value) {
    modal.value.hide()
  }
}

onMounted(() => {
  modal.value = new Modal(document.getElementById('deleteModal'))
})

onUnmounted(() => {
  if (modal.value) {
    modal.value.dispose()
  }
})

defineExpose({
  showModal,
  hideModal,
})
</script>
