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
            <label for="tipe" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="firmwares.tipe"
              type="text"
              class="form-control shadow-none"
              id="tipe"
              placeholder="Masukan Tipe Device"
            />
          </div>
          <div class="mb-3">
            <label for="versi" class="form-label fw-bold">Versi</label>
            <input
              v-model="firmwares.versi"
              type="text"
              class="form-control shadow-none"
              id="versi"
              placeholder="Masukan Versi"
            />
          </div>
          <div class="mb-3">
            <label for="android" class="form-label fw-bold">Android</label>
            <input
              v-model="firmwares.android"
              type="text"
              class="form-control shadow-none"
              id="android"
              placeholder="Masukan Android"
            />
          </div>
          <div class="mb-3">
            <label for="flash" class="form-label fw-bold">Flash</label>
            <input
              v-model="firmwares.flash"
              type="text"
              class="form-control shadow-none"
              id="flash"
              placeholder="Masukan flash"
            />
          </div>
          <div class="mb-3">
            <label for="ota" class="form-label fw-bold">Ota</label>
            <input
              v-model="firmwares.ota"
              type="text"
              class="form-control shadow-none"
              id="ota"
              placeholder="Masukan Ota"
            />
          </div>
          <div class="mb-3">
            <label for="kategori" class="form-label fw-bold">Kategori</label>
            <input
              v-model="firmwares.kategori"
              type="text"
              class="form-control shadow-none"
              id="kategori"
              placeholder="Masukan Kategori"
            />
          </div>
          <div class="mb-3">
            <label for="gambar" class="form-label fw-bold">Gambar</label>
            <input
              @change="handleImageUpload"
              type="file"
              class="form-control shadow-none"
              id="gambar"
              placeholder="Masukan Gambar"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary" @click="addFirmwares">Submit</button>
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

const firmwares = ref({
  tipe: '',
  versi: '',
  android: '',
  flash: '',
  ota: '',
  kategori: '',
  gambar: null,
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

// Handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0]
  // Ensure a file is selected
  if (!file) return
  // Read the file as a data URL
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    firmwares.value.gambar = reader.result
  }
}

async function addFirmwares() {
  try {
    const response = await axios.post('addfirmwares', firmwares.value)
    console.log('Data saved:', response.data)
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
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
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
