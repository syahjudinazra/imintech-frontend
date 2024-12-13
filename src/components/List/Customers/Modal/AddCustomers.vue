<template>
  <button type="button" class="btn btn-danger btn-sm text-white" @click="openModal">
    Add Data
  </button>

  <!-- Modal -->
  <div
    ref="modalElement"
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
              v-model="customers.name"
              type="text"
              class="form-control shadow-none"
              id="name"
              placeholder="Input name"
            />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label fw-bold">Phone</label>
            <input
              v-model="customers.phone"
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
          <div class="mb-3">
            <label for="address" class="form-label fw-bold">Address</label>
            <textarea
              v-model="customers.address"
              type="text"
              class="form-control shadow-none"
              id="address"
              placeholder="Input address"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button
            type="button"
            class="btn btn-danger text-white"
            @click="AddCustomers"
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
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

const customers = ref({
  name: '',
  phone: '',
  address: '',
})
const phoneError = ref(false)
const token = localStorage.getItem('token')
const modalElement = ref(null)
let addForm = ref(null)

onMounted(() => {
  if (modalElement.value) {
    addForm.value = new Modal(modalElement.value)
  }
})

onUnmounted(() => {
  if (addForm.value) {
    addForm.value.dispose()
  }
})

const isFormValid = computed(() => {
  return (
    customers.value.name &&
    customers.value.phone &&
    customers.value.phone.toString().length >= 10 &&
    !phoneError.value
  )
})

function validatePhone() {
  const phoneNumber = customers.value.phone.toString()
  phoneError.value = phoneNumber.length < 10
}

function openModal() {
  customers.value = {
    name: '',
    phone: '',
    address: '',
  }
  phoneError.value = false

  if (addForm.value) {
    addForm.value.show()
  }
}

function closeModal() {
  if (addForm.value) {
    addForm.value.hide()
  }
}

async function AddCustomers() {
  if (!customers.value.name) {
    showToast('Input customer name', 'error')
    return
  }

  if (!customers.value.phone || customers.value.phone.toString().length < 10) {
    showToast('Phone number must be at least 10 digits long', 'error')
    return
  }

  try {
    const response = await axios.post('customers', customers.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Data added successfully:', response.data)
    showToast(response.data.message, 'success')
    closeModal()
  } catch (error) {
    console.error('Error add data:', error)
    showToast(error.response?.data?.message || 'An error occurred', 'error')
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
