<template>
  <button type="button" class="btn btn-danger text-white" @click="openModal">Tambah Data</button>

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
        <form @submit.prevent="addStocks">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Nama</label>
              <input
                v-model="stocksskudevice.name"
                type="text"
                class="form-control shadow-none"
                id="name"
                placeholder="Masukan Nama Device"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-primary">Submit</button>
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

const stocksskudevice = ref({
  name: '',
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

const clearInput = () => {
  stocksskudevice.value = ''
}

const addStocks = async () => {
  if (!stocksskudevice.value.name) {
    showNotification('error', 'Masukan Nama Device')
    return
  }

  try {
    const response = await axios.post('addsliststockssku', stocksskudevice.value)
    console.log('Data berhasil ditambahkan:', response.data)
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal ditambahkan', error)
    showNotification('error', error.response.data.message)
    closeModal()
  }

  clearInput()
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
