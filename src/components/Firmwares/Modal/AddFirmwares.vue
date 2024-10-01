<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger text-white" @click="openModal">Add Data</button>

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
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="addFirmwares">
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
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-danger text-white">Submit</button>
          </div>
        </form>
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

const addFirmwares = async () => {
  try {
    // Prepare form data
    const formData = new FormData()
    formData.append('tipe', firmwares.value.tipe)
    formData.append('versi', firmwares.value.versi)
    formData.append('android', firmwares.value.android)
    formData.append('flash', firmwares.value.flash)
    formData.append('ota', firmwares.value.ota)

    const response = await axios.post('addfirmwares', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Data berhasil ditambahkan:', response.data.data)
    await showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal ditambahkan', error)
    const message = error.response.data.message
    await showNotification('error', message)
    closeModal()
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

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}
</style>
