<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger btn-sm text-white" @click="openModal">
    Add Data
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
          <h5 class="modal-title" id="addForm_label">Add Data</h5>
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
              v-model="sales.name"
              type="text"
              class="form-control shadow-none"
              id="name"
              placeholder="Input name"
            />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label fw-bold">Phone</label>
            <input
              v-model="sales.phone"
              type="number"
              :class="['form-control shadow-none', { 'is-invalid': phoneError }]"
              id="phone"
              placeholder="Input phone min:10"
              @input="validatePhone"
            />
            <div class="invalid-feedback" v-if="phoneError">
              Phone number must be at least 10 digits long
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button
            type="button"
            class="btn btn-danger text-white"
            @click="AddSales"
            :disabled="!isFormValid"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

const sales = ref({})
const phoneError = ref(false)

let addForm

const isFormValid = computed(() => {
  return (
    sales.value.name &&
    sales.value.phone &&
    sales.value.phone.toString().length >= 10 &&
    !phoneError.value
  )
})

function validatePhone() {
  const phoneNumber = sales.value.phone.toString()
  phoneError.value = phoneNumber.length < 10
}

async function AddSales() {
  if (!sales.value.name) {
    showToast('Input sales name', 'error')
    return
  }

  if (!sales.value.phone || sales.value.phone.toString().length < 10) {
    showToast('Phone number must be at least 10 digits long', 'error')
    return
  }

  try {
    const response = await axios.post('sales', sales.value)
    console.log('Data added successfully:', response.data)
    showToast(response.data.message, 'success')
    closeModal()
  } catch (error) {
    console.error('Error add data:', error)
    showToast(error.data.message, 'error')
  }
}

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
})
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
