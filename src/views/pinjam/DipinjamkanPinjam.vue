<template>
  <div class="container-fluid">
    <AddPinjam />
    <div class="d-flex align-items-end justify-content-between">
      <caption class="fw-bold">
        List of Data Dipinjamkan
      </caption>
      <div class="input-group mb-2 w-auto">
        <input
          type="text"
          class="form-control shadow-none"
          placeholder="Search..."
          aria-label="Search..."
          aria-describedby="search"
          v-model="searchQuery"
        />
        <button
          @click="searchPinjam"
          class="btn btn-outline-danger shadow-none"
          type="button"
          id="search"
        >
          Submit
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table caption-top">
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Serial Number</th>
            <th>Tipe Device</th>
            <th>Pelanggan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="pinjams.length > 0">
          <tr v-for="(pinjam, index) in pinjams" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(pinjam.tanggal) }}</td>
            <td>{{ pinjam.serialnumber }}</td>
            <td>{{ pinjam.pinjamsdevice.name }}</td>
            <td>{{ pinjam.pelanggan }}</td>
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
                  <li><a class="dropdown-item" href="#" @click="moveModal(pinjam)">Pindah</a></li>
                  <li><a class="dropdown-item" href="#" @click="editModal(pinjam)">Ubah</a></li>
                  <li><a class="dropdown-item" href="#" @click="deleteModal(pinjam)">Hapus</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="pinjams.length === 0">
          <tr>
            <td colspan="7" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" class="text-center">Loading...</td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-between">
        <caption>
          Menampilkan
          {{
            pagination.per_page
          }}
          dari
          {{
            pagination.total
          }}
          data
        </caption>
        <nav aria-label="Page navigation">
          <ul class="pagination d-flex justify-content-end">
            <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
              <a
                class="page-link shadow-none"
                href="#"
                @click.prevent="fetchPinjam(pagination.prev_page_url)"
                >Kembali</a
              >
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.current_page }"
            >
              <a class="page-link shadow-none" href="#" @click.prevent="fetchDevice(page)">{{
                page
              }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
              <a
                class="page-link shadow-none"
                href="#"
                @click.prevent="fetchPinjam(pagination.next_page_url)"
                >Lanjut</a
              >
            </li>
          </ul>
        </nav>
      </div>
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
              class="form-control shadow-none bg-light"
              id="tanggal"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
            <input
              v-model="viewPinjamData.serialnumber"
              type="text"
              class="form-control shadow-none bg-light"
              id="serialnumber"
              readonly
            />
          </div>
          <div class="mb-3" v-if="viewPinjamData.pinjamsdevice">
            <label class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="viewPinjamData.pinjamsdevice.name"
              type="text"
              class="form-control shadow-none bg-light"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="ram" class="form-label fw-bold">RAM</label>
            <input
              v-model="viewPinjamData.ram"
              type="text"
              class="form-control shadow-none bg-light"
              id="ram"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="android" class="form-label fw-bold">Android</label>
            <input
              v-model="viewPinjamData.android"
              type="text"
              class="form-control shadow-none bg-light"
              id="android"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
            <input
              v-model="viewPinjamData.pelanggan"
              type="text"
              class="form-control shadow-none bg-light"
              id="pelanggan"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="alamat" class="form-label fw-bold">Alamat</label>
            <textarea
              v-model="viewPinjamData.alamat"
              class="form-control shadow-none bg-light"
              id="alamat"
              readonly
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="sales" class="form-label fw-bold">Sales</label>
            <input
              v-model="viewPinjamData.sales"
              type="text"
              class="form-control shadow-none bg-light"
              id="sales"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="no_telp" class="form-label fw-bold">No Telp</label>
            <input
              v-model="viewPinjamData.no_telp"
              type="text"
              class="form-control shadow-none bg-light"
              id="no_telp"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pengirim" class="form-label fw-bold">Pengirim</label>
            <input
              v-model="viewPinjamData.pengirim"
              type="text"
              class="form-control shadow-none bg-light"
              id="pengirim"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="kelengkapankirim" class="form-label fw-bold">Kelengkapan Kirim</label>
            <textarea
              v-model="viewPinjamData.kelengkapankirim"
              class="form-control shadow-none bg-light"
              id="kelengkapankirim"
              readonly
            ></textarea>
          </div>
          <div class="mb-3" hidden>
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
            <div class="mb-3" v-if="editedPinjam.pinjamsdevice">
              <label class="fw-bold" for="pinjamsdevice_id">Tipe Device</label>
              <select
                class="form-select form-control-chosen shadow-none"
                name="pinjamsdevice_id"
                id="pinjamsdevice_id"
                v-model="editedPinjam.pinjamsdevice.id"
                @input="(event) => (editedPinjam.pinjamsdevice_id = event.target.value)"
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
              <textarea
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
              <textarea
                v-model="editedPinjam.kelengkapankirim"
                type="text"
                class="form-control shadow-none"
                id="kelengkapankirim"
                placeholder="Masukan Kelengkapan Kirim"
              />
            </div>
            <div class="form-group mb-3" hidden>
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="status"
                  v-model="editedPinjam.status"
                  :true-value="'Dipinjamkan'"
                  :false-value="'Dipinjamkan'"
                  checked
                />
                <label class="form-check-label" for="status">Dipinjamkan</label>
              </div>
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

  <!--Move Modal-->
  <div
    class="modal fade"
    id="moveForm"
    tabindex="-1"
    aria-labelledby="moveForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="moveForm_label">Pindah Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="movePinjam" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3" hidden>
              <label for="tanggal" class="form-label fw-bold">Tanggal</label>
              <input
                v-model="movedPinjam.tanggal"
                type="date"
                class="form-control shadow-none"
                id="tanggal"
                placeholder="Masukan Tanggal"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="movedPinjam.serialnumber"
                type="text"
                class="form-control shadow-none"
                id="serialnumber"
                placeholder="Masukan Serial Number"
              />
            </div>
            <div class="mb-3" v-if="movedPinjam.pinjamsdevice" hidden>
              <label class="fw-bold" for="pinjamsdevice_id">Tipe Device</label>
              <select
                class="form-select form-control-chosen shadow-none"
                name="pinjamsdevice_id"
                id="pinjamsdevice_id"
                v-model="movedPinjam.pinjamsdevice.id"
                @input="(event) => (movedPinjam.pinjamsdevice_id = event.target.value)"
              >
                <option value="" disabled selected>Pilih Tipe Device</option>
                <option v-for="device in pinjamsdevice" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div class="mb-3" hidden>
              <label for="ram" class="form-label fw-bold">RAM</label>
              <input
                v-model="movedPinjam.ram"
                type="text"
                class="form-control shadow-none"
                id="ram"
                placeholder="Masukan RAM"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="android" class="form-label fw-bold">Android</label>
              <input
                v-model="movedPinjam.android"
                type="text"
                class="form-control shadow-none"
                id="android"
                placeholder="Masukan Android"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
              <input
                v-model="movedPinjam.pelanggan"
                type="text"
                class="form-control shadow-none"
                id="pelanggan"
                placeholder="Masukan Pelanggan"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="alamat" class="form-label fw-bold">Alamat</label>
              <textarea
                v-model="movedPinjam.alamat"
                type="text"
                class="form-control shadow-none"
                id="alamat"
                placeholder="Masukan Alamat"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="sales" class="form-label fw-bold">Sales</label>
              <input
                v-model="movedPinjam.sales"
                type="text"
                class="form-control shadow-none"
                id="sales"
                placeholder="Masukan Sales"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="no_telp" class="form-label fw-bold">No Telp</label>
              <input
                v-model="movedPinjam.no_telp"
                type="text"
                class="form-control shadow-none"
                id="no_telp"
                placeholder="Masukan No Telp"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="pengirim" class="form-label fw-bold">Pengirim</label>
              <input
                v-model="movedPinjam.pengirim"
                type="text"
                class="form-control shadow-none"
                id="pengirim"
                placeholder="Masukan Pengirim"
              />
            </div>
            <div class="mb-3" hidden>
              <label for="kelengkapankirim" class="form-label fw-bold">Kelengkapan Kirim</label>
              <textarea
                v-model="movedPinjam.kelengkapankirim"
                type="text"
                class="form-control shadow-none"
                id="kelengkapankirim"
                placeholder="Masukan Kelengkapan Kirim"
              />
            </div>
            <div class="mb-3">
              <label for="tanggalkembali" class="form-label fw-bold">Tanggal Kembali</label>
              <input
                v-model="movedPinjam.tanggalkembali"
                type="date"
                class="form-control shadow-none"
                id="tanggalkembali"
                placeholder="Masukan Tanggal Kembali"
              />
            </div>
            <div class="mb-3">
              <label for="penerima" class="form-label fw-bold">Penerima</label>
              <input
                v-model="movedPinjam.penerima"
                type="text"
                class="form-control shadow-none"
                id="penerima"
                placeholder="Masukan Penerima"
              />
            </div>
            <div class="mb-3">
              <label for="kelengkapankembali" class="form-label fw-bold">Kelengkapan Kembali</label>
              <textarea
                v-model="movedPinjam.kelengkapankembali"
                type="text"
                class="form-control shadow-none"
                id="kelengkapankembali"
                placeholder="Masukan Kelengkapan Kembali"
              />
            </div>
            <div class="form-group mb-3">
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="status"
                  v-model="movedPinjam.status"
                  :true-value="'Dikembalikan'"
                  :false-value="'Dipinjamkan'"
                  checked
                />
                <label class="form-check-label" for="status">Dikembalikan</label>
              </div>
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
import { ref, onMounted, nextTick, computed } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

import AddPinjam from '../../components/ModalPinjam/AddPinjam.vue'

let viewForm
let moveForm
let editForm
let deleteForm
const pinjams = ref([])
const viewPinjamData = ref({})
const editedPinjam = ref({})
const movedPinjam = ref({})
const id = ref(null)
const pinjamsdevice = ref([])
const pagination = ref({})
const pageSize = 3
const searchQuery = ref('')

onMounted(async () => {
  await nextTick()
  viewForm = new Modal(document.getElementById('viewForm'), {})
  moveForm = new Modal(document.getElementById('moveForm'), {})
  editForm = new Modal(document.getElementById('editForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
  fetchPinjam()
  fetchDevice()
})

function viewModal(pinjam) {
  viewPinjamData.value = { ...pinjam }
  id.value = pinjam.id
  viewForm.show()
}

function moveModal(pinjam) {
  movedPinjam.value = { ...pinjam }
  id.value = pinjam.id
  moveForm.show()
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
  moveForm.hide()
  editForm.hide()
  deleteForm.hide()
}

const fetchPinjam = async (url = 'getpinjam') => {
  try {
    const response = await axios.get(url, {
      params: {
        search: searchQuery.value,
      },
    })
    pinjams.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

const fetchDevice = async () => {
  try {
    const response = await axios.get('getlistpinjam')
    pinjamsdevice.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

const updatePinjam = async () => {
  try {
    const response = await axios.put(`updatepinjam/${id.value}`, editedPinjam.value)
    pinjams.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Failed to update data', error)
    showNotification('error', error.response.data.message)
    closeModal()
  }
}

const movePinjam = async () => {
  try {
    const response = await axios.put(`movepinjam/${id.value}`, movedPinjam.value)
    pinjams.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Failed to update data', error)
    showNotification('error', error.response.data.message)
    closeModal()
  }
}

const deletePinjam = async () => {
  try {
    const response = await axios.delete(`destroypinjam/${id.value}`)
    pinjams.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Failed to delete data', error)
    showNotification('error', error.response.data.message)
    closeModal()
  }
}

const searchPinjam = () => {
  fetchPinjam()
}

// Computed property to determine the visible pages
const visiblePages = computed(() => {
  const start = Math.max(1, pagination.value.current_page - Math.floor(pageSize / 2))
  const end = Math.min(pagination.value.last_page, start + pageSize - 1)

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const formatDate = (date) => {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}-${month}-${year}`
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
