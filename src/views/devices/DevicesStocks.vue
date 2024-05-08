<template>
  <CContainer fluid>
    <AddStocksDevices />
    <div class="table-responsive">
      <table class="table caption-top">
        <caption class="fw-bold">
          List of Stocks Device
        </caption>
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="stocksdevices.length > 0">
          <tr v-for="(stocksdevice, index) in stocksdevices" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ stocksdevice.name }}</td>
            <td class="d-flex gap-2">
              <a href="#" type="button" class="btn btn-primary" @click="editModal(stocksdevice)"
                >Edit</a
              >
              <a
                href="#"
                type="button"
                class="btn btn-danger text-white"
                @click="deleteModal(stocksdevice)"
                >Hapus</a
              >
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="3">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </CContainer>

  <!--Edit Modal-->
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
          <h5 class="modal-title" id="editForm_label">Edit Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="updateStocks" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Nama Device</label>
              <input
                v-model="editedStocksDevice.name"
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

  <!--Delete Modal-->
  <div class="modal fade show" id="deleteForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Hapus Stocks</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Yakin mau hapus data ini?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="deleteStocks">
            Delete
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
import Swal from 'sweetalert2'

import AddStocksDevices from '../../components/ModalStocksDevices/AddStocksDevices.vue'
import { CContainer } from '@coreui/vue'

let editForm
let deleteForm
const editedStocksDevice = ref({})
const stocksdevices = ref([])
const id = ref(null)

onMounted(() => {
  editForm = new Modal(document.getElementById('editForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
})

function editModal(stocksdevice) {
  editedStocksDevice.value = { ...stocksdevice }
  id.value = stocksdevice.id
  editForm.show()
}

function deleteModal(stocksdevice) {
  id.value = stocksdevice.id
  deleteForm.show()
}

function closeModal() {
  editForm.hide()
  deleteForm.hide()
}

function updateStocks() {
  axios
    .put(`updateliststocks/${id.value}`, editedStocksDevice.value)
    .then((response) => {
      stocksdevices.value = response.data.data
      showNotification('success', response.data.message)
      closeModal()
    })
    .catch((error) => {
      console.error('Failed to update data', error)
      showNotification('error', error.response.data.message)
      closeModal()
    })
}

function deleteStocks() {
  axios
    .delete(`destroyliststocks/${id.value}`)
    .then((response) => {
      stocksdevices.value = response.data.data
      showNotification('success', response.data.message)
      closeModal()
    })
    .catch((error) => {
      console.error('Failed to delete data', error)
      showNotification('error', error.response.data.message)
      closeModal()
    })
}

function getDevicesStocks() {
  axios
    .get('getliststocks')
    .then((response) => {
      stocksdevices.value = response.data.data
    })
    .catch((error) => {
      console.error('Failed to fetch data', error)
    })
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

getDevicesStocks()
</script>
