<template>
  <div class="container-fluid">
    <AddPinjamDevices />
    <div class="table-responsive">
      <table class="table caption-top">
        <caption class="fw-bold">
          List of Pinjam Device
        </caption>
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="pinjamdevices.length > 0">
          <tr v-for="(pinjamdevice, index) in pinjamdevices" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ pinjamdevice.name }}</td>
            <td class="d-flex gap-2">
              <a href="#" type="button" class="btn btn-primary" @click="editModal(pinjamdevice)"
                >Edit</a
              >
              <a
                href="#"
                type="button"
                class="btn btn-danger text-white"
                @click="deleteModal(pinjamdevice)"
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
  </div>

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
        <form @submit.prevent="updatePinjam" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Nama Device</label>
              <input
                v-model="editedPinjamDevice.name"
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
          <h5 class="modal-title">Hapus Pinjam</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Yakin mau hapus data ini?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="deletePinjam">
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

import AddPinjamDevices from '../../components/ModalPinjamDevices/AddPinjamDevices.vue'

let editForm
let deleteForm
const editedPinjamDevice = ref({})
const pinjamdevices = ref([])
const id = ref(null)

onMounted(() => {
  editForm = new Modal(document.getElementById('editForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
})

function editModal(pinjamdevice) {
  editedPinjamDevice.value = { ...pinjamdevice }
  id.value = pinjamdevice.id
  editForm.show()
}

function deleteModal(pinjamdevice) {
  id.value = pinjamdevice.id
  deleteForm.show()
}

function closeModal() {
  editForm.hide()
  deleteForm.hide()
}

function updatePinjam() {
  axios
    .put(`updatelistpinjam/${id.value}`, editedPinjamDevice.value)
    .then((response) => {
      pinjamdevices.value = response.data.data
      showNotification('success', response.data.message)
      closeModal()
    })
    .catch((error) => {
      console.error('Failed to update data', error)
      showNotification('error', error.response.data.message)
      closeModal()
    })
}

function deletePinjam() {
  axios
    .delete(`destroylistpinjam/${id.value}`)
    .then((response) => {
      pinjamdevices.value = response.data.data
      showNotification('success', response.data.message)
      closeModal()
    })
    .catch((error) => {
      console.error('Failed to delete data', error)
      showNotification('error', error.response.data.message)
      closeModal()
    })
}

function getDevicesPinjam() {
  axios
    .get('getlistpinjam')
    .then((response) => {
      pinjamdevices.value = response.data.data
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

getDevicesPinjam()
</script>
