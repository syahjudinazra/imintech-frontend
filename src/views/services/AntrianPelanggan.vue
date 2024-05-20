<template>
  <CContainer fluid>
    <div class="table-responsive">
      <table class="table caption-top">
        <caption class="fw-bold">
          List of Data Antrian Pelanggan
        </caption>
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Tanggal Masuk</th>
            <th>Serial Number</th>
            <th>Pelanggan</th>
            <th>Device</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="services.length > 0">
          <tr v-for="(service, index) in services" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ service.tanggalmasuk }}</td>
            <td>{{ service.serialnumber }}</td>
            <td>{{ service.pelanggan }}</td>
            <td>{{ service.servicesdevice.name }}</td>
            <td class="d-flex gap-2">
              <a href="#" class="head-text text-decoration-none" @click="viewModal(service)"
                >Lihat</a
              >
              <div class="btn-group dropend">
                <a
                  class="dropdown-toggle text-decoration-none"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Lainya
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#" @click="editModal(service)">Ubah</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click="deleteModal(service)">Hapus</a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </CContainer>

  <!-- View Services -->
  <div
    class="modal fade"
    id="viewForm"
    tabindex="-1"
    aria-labelledby="viewForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="viewForm_label">Lihat Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="pemilik" class="form-label fw-bold">Pemilik</label>
            <input
              v-model="viewServicesForm.pemilik"
              type="text"
              class="form-control shadow-none"
              id="pemilik"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
            <input
              v-model="viewServicesForm.pelanggan"
              type="text"
              class="form-control shadow-none"
              id="pelanggan"
              readonly
            />
          </div>
          <div class="mb-3" v-if="viewServicesForm.servicesdevice">
            <label for="name" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="viewServicesForm.servicesdevice.name"
              type="text"
              class="form-control shadow-none"
              id="name"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
            <input
              v-model="viewServicesForm.serialnumber"
              type="text"
              class="form-control shadow-none"
              id="serialnumber"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pemakaian" class="form-label fw-bold">Pemakaian</label>
            <input
              v-model="viewServicesForm.pemakaian"
              type="text"
              class="form-control shadow-none"
              id="pemakaian"
              readonly
            />
          </div>
          <div class="form-group mb-3">
            <label class="fw-bold" for="kerusakan">Kerusakan</label>
            <textarea
              type="text"
              class="form-control shadow-none"
              id="kerusakan"
              name="kerusakan"
              v-model="viewServicesForm.kerusakan"
              readonly
            ></textarea>
          </div>
          <div class="form-group mb-3">
            <label class="fw-bold" for="tanggalmasuk">Tanggal Masuk</label>
            <input
              type="date"
              class="form-control shadow-none"
              id="tanggalmasuk"
              name="tanggalmasuk"
              v-model="viewServicesForm.tanggalmasuk"
              readonly
            />
          </div>
          <div class="form-group mb-3">
            <label class="fw-bold" for="catatan">Catatan</label>
            <textarea
              type="text"
              class="form-control shadow-none"
              id="catatan"
              name="catatan"
              v-model="viewServicesForm.catatan"
              readonly
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
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
        <form @submit.prevent="updateService" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="pemilik" class="form-label fw-bold">Pemilik</label>
              <input
                v-model="editServicesForm.pemilik"
                type="text"
                class="form-control shadow-none"
                id="pemilik"
              />
            </div>
            <div class="mb-3">
              <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
              <input
                v-model="editServicesForm.pelanggan"
                type="text"
                class="form-control shadow-none"
                id="pelanggan"
              />
            </div>
            <div class="mb-3" v-if="editServicesForm.servicesdevice">
              <label class="form-label fw-bold">Tipe Device</label>
              <input
                v-model="editServicesForm.servicesdevice.name"
                type="text"
                class="form-control shadow-none"
              />
            </div>
            <div class="mb-3">
              <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="editServicesForm.serialnumber"
                type="text"
                class="form-control shadow-none"
                id="serialnumber"
              />
            </div>
            <div class="mb-3">
              <label for="pemakaian" class="form-label fw-bold">Pemakaian</label>
              <input
                v-model="editServicesForm.pemakaian"
                type="text"
                class="form-control shadow-none"
                id="pemakaian"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="kerusakan">Kerusakan</label>
              <textarea
                type="text"
                class="form-control shadow-none"
                id="kerusakan"
                name="kerusakan"
                v-model="editServicesForm.kerusakan"
              ></textarea>
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="tanggalmasuk">Tanggal Masuk</label>
              <input
                type="date"
                class="form-control shadow-none"
                id="tanggalmasuk"
                name="tanggalmasuk"
                v-model="editServicesForm.tanggalmasuk"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="catatan">Catatan</label>
              <textarea
                type="text"
                class="form-control shadow-none"
                id="catatan"
                name="catatan"
                v-model="editServicesForm.catatan"
              ></textarea>
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
          <h5 class="modal-title">Hapus Service</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Yakin mau hapus data ini?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="deleteService">
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

let viewForm
let editForm
let deleteForm
const services = ref([])
const viewServicesForm = ref({})
const editServicesForm = ref({})
const id = ref(null)

onMounted(() => {
  viewForm = new Modal(document.getElementById('viewForm'), {})
  editForm = new Modal(document.getElementById('editForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
})

function viewModal(service) {
  viewServicesForm.value = { ...service }
  id.value = service.id
  viewForm.show()
}

function editModal(service) {
  editServicesForm.value = { ...service }
  id.value = service.id
  editForm.show()
}

function deleteModal(service) {
  id.value = service.id
  deleteForm.show()
}

function closeModal() {
  editForm.hide()
  viewForm.hide()
  deleteForm.hide()
}

function getService() {
  axios
    .get('getservices')
    .then((response) => {
      services.value = response.data.data
    })
    .catch((error) => {
      console.error('Failed to fetch data', error)
    })
}

function updateService() {
  axios
    .put(`updateservices/${id.value}`, editServicesForm.value)
    .then((response) => {
      console.log('Failed to update service', response)
      services.value = response.data.data
      showNotification('success', response.data.message)
      closeModal()
    })
    .catch((error) => {
      console.error('Failed to update data', error)
      // showNotification('error', error.response.data.message)
      closeModal()
    })
}

function deleteService() {
  axios
    .delete(`destroyservices/${id.value}`)
    .then((response) => {
      services.value = response.data.data
      showNotification('success', response.data.message)
      closeModal()
    })
    .catch((error) => {
      console.error('Failed to delete data', error)
      showNotification('error', error.response.data.message)
      closeModal()
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

getService()
</script>
