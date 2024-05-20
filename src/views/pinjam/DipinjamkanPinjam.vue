<template>
  <div class="container-fluid">
    <AddPinjam />
    <div class="table-responsive">
      <table class="table caption-top">
        <caption class="fw-bold">
          List of Pinjam
        </caption>
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Serial Number</th>
            <th>Tipe Device</th>
            <th>Pelanggan</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="pinjams.length > 0">
          <tr v-for="(pinjam, index) in pinjams" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ pinjam.tanggal }}</td>
            <td>{{ pinjam.serialnumber }}</td>
            <td>{{ pinjam.pinjamsdevice.name }}</td>
            <td>{{ pinjam.pelanggan }}</td>
            <td>{{ pinjam.status }}</td>
            <td class="d-flex gap-2">
              <a href="#" class="head-text text-decoration-none" @click="viewModal(pinjam)"
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
                  <li><a class="dropdown-item" href="#" @click="editModal(pinjam)">Ubah</a></li>
                  <li><a class="dropdown-item" href="#" @click="deleteModal(pinjam)">Hapus</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7">Loading...</td>
          </tr>
        </tbody>
      </table>
      <PaginationTable />
    </div>
  </div>

  <!-- View Modal -->
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
            <label for="tanggal" class="form-label fw-bold">Tanggal</label>
            <input
              v-model="viewPinjamData.tanggal"
              type="date"
              class="form-control shadow-none"
              id="tanggal"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
            <input
              v-model="viewPinjamData.serialnumber"
              type="text"
              class="form-control shadow-none"
              id="serialnumber"
              readonly
            />
          </div>
          <div class="mb-3" v-if="viewPinjamData.pinjamsdevice">
            <label class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="viewPinjamData.pinjamsdevice.name"
              type="text"
              class="form-control shadow-none"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="ram" class="form-label fw-bold">RAM</label>
            <input
              v-model="viewPinjamData.ram"
              type="text"
              class="form-control shadow-none"
              id="ram"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="android" class="form-label fw-bold">Android</label>
            <input
              v-model="viewPinjamData.android"
              type="text"
              class="form-control shadow-none"
              id="android"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
            <input
              v-model="viewPinjamData.pelanggan"
              type="text"
              class="form-control shadow-none"
              id="pelanggan"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="alamat" class="form-label fw-bold">Alamat</label>
            <textarea
              v-model="viewPinjamData.alamat"
              class="form-control shadow-none"
              id="alamat"
              readonly
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="sales" class="form-label fw-bold">Sales</label>
            <input
              v-model="viewPinjamData.sales"
              type="text"
              class="form-control shadow-none"
              id="sales"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="no_telp" class="form-label fw-bold">No Telp</label>
            <input
              v-model="viewPinjamData.no_telp"
              type="text"
              class="form-control shadow-none"
              id="no_telp"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pengirim" class="form-label fw-bold">Pengirim</label>
            <input
              v-model="viewPinjamData.pengirim"
              type="text"
              class="form-control shadow-none"
              id="pengirim"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="kelengkapankirim" class="form-label fw-bold">Kelengkapan Kirim</label>
            <textarea
              v-model="viewPinjamData.kelengkapankirim"
              class="form-control shadow-none"
              id="kelengkapankirim"
              readonly
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="status" class="form-label fw-bold">Status</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="status"
                v-model="viewPinjamData.status"
                readonly
                :checked="viewPinjamData.status"
              />
              <label class="form-check-label" for="status">Dipinjamkan</label>
            </div>
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
        <form @submit.prevent="updatePinjam" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="tanggal" class="form-label fw-bold">Tanggal</label>
              <input
                v-model="editedPinjam.tanggal"
                type="date"
                class="form-control shadow-none"
                id="tanggal"
                placeholder="Masukan Tanggal"
              />
            </div>
            <div class="mb-3">
              <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="editedPinjam.serialnumber"
                type="text"
                class="form-control shadow-none"
                id="serialnumber"
                placeholder="Masukan Serial Number"
              />
            </div>
            <div class="mb-3">
              <label class="fw-bold" for="pinjamsdevice_id">Tipe Device</label>
              <select
                class="form-select form-control-chosen shadow-none"
                name="pinjamsdevice_id"
                id="pinjamsdevice_id"
                v-model="editedPinjam.pinjamsdevice_id"
                required
              >
                <option value="" disabled selected>Pilih Tipe Device</option>
                <option v-for="device in pinjamsdevice" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="ram" class="form-label fw-bold">RAM</label>
              <input
                v-model="editedPinjam.ram"
                type="text"
                class="form-control shadow-none"
                id="ram"
                placeholder="Masukan RAM"
              />
            </div>
            <div class="mb-3">
              <label for="android" class="form-label fw-bold">Android</label>
              <input
                v-model="editedPinjam.android"
                type="text"
                class="form-control shadow-none"
                id="android"
                placeholder="Masukan Android"
              />
            </div>
            <div class="mb-3">
              <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
              <input
                v-model="editedPinjam.pelanggan"
                type="text"
                class="form-control shadow-none"
                id="pelanggan"
                placeholder="Masukan Pelanggan"
              />
            </div>
            <div class="mb-3">
              <label for="alamat" class="form-label fw-bold">Alamat</label>
              <input
                v-model="editedPinjam.alamat"
                type="text"
                class="form-control shadow-none"
                id="alamat"
                placeholder="Masukan Alamat"
              />
            </div>
            <div class="mb-3">
              <label for="sales" class="form-label fw-bold">Sales</label>
              <input
                v-model="editedPinjam.sales"
                type="text"
                class="form-control shadow-none"
                id="sales"
                placeholder="Masukan Sales"
              />
            </div>
            <div class="mb-3">
              <label for="no_telp" class="form-label fw-bold">No Telp</label>
              <input
                v-model="editedPinjam.no_telp"
                type="text"
                class="form-control shadow-none"
                id="no_telp"
                placeholder="Masukan No Telp"
              />
            </div>
            <div class="mb-3">
              <label for="pengirim" class="form-label fw-bold">Pengirim</label>
              <input
                v-model="editedPinjam.pengirim"
                type="text"
                class="form-control shadow-none"
                id="pengirim"
                placeholder="Masukan Pengirim"
              />
            </div>
            <div class="mb-3">
              <label for="kelengkapankirim" class="form-label fw-bold">Kelengkapan Kirim</label>
              <input
                v-model="editedPinjam.kelengkapankirim"
                type="text"
                class="form-control shadow-none"
                id="kelengkapankirim"
                placeholder="Masukan Kelengkapan Kirim"
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

import AddPinjam from '../../components/ModalPinjam/AddPinjam.vue'
import PaginationTable from '../../components/Pagination/PaginationTable.vue'

let viewForm
let editForm
let deleteForm
const viewPinjamData = ref({})
const editedPinjam = ref({})
const pinjams = ref([])
const pinjamsdevice = ref([])
const id = ref(null)

onMounted(() => {
  viewForm = new Modal(document.getElementById('viewForm'), {})
  editForm = new Modal(document.getElementById('editForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
  getPinjam()
  fetchDevice()
})

function viewModal(pinjam) {
  viewPinjamData.value = { ...pinjam }
  id.value = pinjam.id
  viewForm.show()
}

function editModal(pinjam) {
  editedPinjam.value = { ...pinjam }
  id.value = pinjam.id
  editForm.show()
}

function deleteModal(pinjam) {
  id.value = pinjam.id
  deleteForm.show()
}

function closeModal() {
  viewForm.hide()
  editForm.hide()
  deleteForm.hide()
}

function updatePinjam() {
  axios
    .put(`updatepinjam/${id.value}`, editedPinjam.value)
    .then((response) => {
      pinjams.value = response.data.data
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
    .delete(`destroypinjam/${id.value}`)
    .then((response) => {
      pinjams.value = response.data.data
      showNotification('success', response.data.message)
      closeModal()
    })
    .catch((error) => {
      console.error('Failed to delete data', error)
      showNotification('error', error.response.data.message)
      closeModal()
    })
}

function getPinjam() {
  axios
    .get('getpinjam')
    .then((response) => {
      pinjams.value = response.data.data
    })
    .catch((error) => {
      console.error('Failed to fetch data', error)
    })
}

const fetchDevice = async () => {
  try {
    const response = await axios.get('getlistpinjam')
    console.log('Data berhasil ditemukan:', response.data.data)
    pinjamsdevice.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
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
