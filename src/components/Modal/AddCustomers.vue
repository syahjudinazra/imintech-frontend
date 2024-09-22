<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger btn-sm text-white" @click="openModal">
    Add Customers
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
          <h5 class="modal-title" id="addForm_label">Add Customers</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
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
              class="form-control shadow-none"
              id="phone"
              placeholder="Input phone"
            />
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
          <button type="button" class="btn btn-primary" @click="AddCustomers">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

const customers = ref({
  name: '',
  phone: '',
  address: '',
})
const token = localStorage.getItem('token')
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

async function AddCustomers() {
  if (!customers.value.name) {
    showNotification('error', 'Masukan Nama Device')
    return
  }

  try {
    const response = await axios.post('add-customers', customers.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Data added successfully:', response.data)
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Error saving data:', error)
    showNotification('error', error.response.data.message)
  }
}

function showNotification(type, message) {
  return new Promise((resolve) => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
      // didClose: () => {
      //   window.location.reload()
      // },
    })
    toast
      .fire({
        icon: type,
        title: message,
      })
      .then(() => {
        resolve()
      })
  })
}
</script>
