<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger btn-sm text-white" @click="openModal">
    Add data
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addForm"
    tabindex="-1"
    aria-labelledby="addForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addForm_label">Add data</h5>
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="name" class="form-label fw-bold">Name</label>
            <input
              v-model="stocksDevice.name"
              type="text"
              class="form-control shadow-none"
              id="name"
              placeholder="Input name"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button
            type="submit"
            class="btn btn-danger text-white"
            @click="AddStocksDevice"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

const stocksDevice = ref({
  name: '',
})
const isLoading = ref(false)
let addForm

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

async function AddStocksDevice() {
  if (!stocksDevice.value.name) {
    showToast('Input stocks device name', 'error')
    return
  }

  try {
    isLoading.value = true
    const response = await axios.post('stocks-device', stocksDevice.value)
    console.log('Data added successfully:', response.data.message)
    showToast(response.data.message, 'success')
    closeModal()
  } catch (error) {
    console.error('Error add data:', error)
    showToast(error.data.message, 'error')
  }
}
</script>

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}
</style>
