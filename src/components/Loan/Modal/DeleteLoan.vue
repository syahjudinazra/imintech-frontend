<template>
  <div class="modal fade" id="deleteForm" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Loan Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this loan data?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="deleteLoan">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

const props = defineProps({
  loanId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close', 'refresh'])

let modal = null

const deleteLoan = async () => {
  try {
    const response = await axios.delete(`loans/${props.loanId}`)
    showToast(response.data.message || 'Loan deleted successfully', 'success')
    closeModal()
    emit('refresh')
  } catch (error) {
    console.error('Error deleting loan:', error)
    showToast(error.response?.data?.message || 'Failed to delete loan', 'error')
  }
}

const closeModal = () => {
  modal?.hide()
  emit('close')
}

const showModal = () => {
  modal.show()
}

defineExpose({ showModal })
</script>
