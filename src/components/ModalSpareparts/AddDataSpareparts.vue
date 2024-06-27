<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger text-white" @click="openModal">Tambah Data</button>

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
          <h5 class="modal-title" id="addForm_label">Tambah Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="nosparepart" class="form-label fw-bold">No Spareparts</label>
            <input
              v-model="spareparts.nosparepart"
              type="text"
              class="form-control shadow-none"
              id="nosparepart"
              placeholder="Masukan No Spareparts"
            />
          </div>
          <div class="mb-3">
            <label for="tipe" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="spareparts.tipe"
              type="text"
              class="form-control shadow-none"
              id="tipe"
              placeholder="Masukan Tipe Device"
            />
          </div>
          <div class="mb-3">
            <label for="nama" class="form-label fw-bold">Nama</label>
            <input
              v-model="spareparts.nama"
              type="text"
              class="form-control shadow-none"
              id="nama"
              placeholder="Masukan Nama"
            />
          </div>
          <div class="mb-3">
            <label for="quantity" class="form-label fw-bold">Quantity</label>
            <input
              v-model="spareparts.quantity"
              type="number"
              class="form-control shadow-none"
              id="quantity"
              placeholder="Masukan Quantity"
            />
          </div>
          <div class="mb-3">
            <label for="harga" class="form-label fw-bold">Harga</label>
            <input
              v-model="spareparts.harga"
              type="number"
              class="form-control shadow-none"
              id="harga"
              placeholder="Masukan Harga"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary" @click="AddDataSpareparts">Submit</button>
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

const spareparts = ref({
  nosparepart: '',
  tipe: '',
  nama: '',
  quantity: '',
  harga: '',
})

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

async function AddDataSpareparts() {
  try {
    const response = await axios.post('addspareparts', spareparts.value)
    console.log('Data saved:', response.data)
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Error saving data:', error)
    showNotification('error', error.response.data.message)
    closeModal()
  }
}

function showNotification(type, message) {
  return new Promise((resolve) => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
      didClose: () => {
        window.location.reload()
      },
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
