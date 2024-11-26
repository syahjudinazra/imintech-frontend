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
          <h5 class="modal-title" id="editForm_label">Edit Loan Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="updateLoan" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="serial_number" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="editLoanData.serial_number"
                type="text"
                class="form-control shadow-none"
                id="serial_number"
              />
            </div>
            <div class="mb-3">
              <label for="loan_devices_id" class="form-label fw-bold">Device Type</label>
              <input
                v-model="editLoanData.loan_devices_id"
                type="text"
                class="form-control shadow-none"
                id="loan_devices_id"
              />
            </div>
            <div class="mb-3">
              <label for="customers_id" class="form-label fw-bold">Customer</label>
              <input
                v-model="editLoanData.customers_id"
                type="text"
                class="form-control shadow-none"
                id="customers_id"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

const props = defineProps({
  loanData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'refresh'])

const editLoanData = ref({ ...props.loanData })
let modal = null

const updateLoan = async () => {
  try {
    const response = await axios.put(`loans/${editLoanData.value.id}`, editLoanData.value)
    showToast(response.data.message || 'Loan updated successfully', 'success')
    closeModal()
    emit('refresh')
  } catch (error) {
    console.error('Error updating loan:', error)
    showToast(error.response?.data?.message || 'Failed to update loan', 'error')
  }
}

const closeModal = () => {
  modal?.hide()
  emit('close')
}

const showModal = () => {
  editLoanData.value = { ...props.loanData }
  modal.show()
}

defineExpose({ showModal })
</script>
