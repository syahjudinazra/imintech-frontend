<template>
  <div class="container-fluid">
    <AddDataSpareparts />
    <div class="d-flex gap-2 align-items-center justify-content-end">
      <div class="div">
        <select v-model="searchField" class="form-select shadow-none" id="searchField">
          <option selected>Cari berdasarkan kolom</option>
          <option value="nosparepart">No Spareparts</option>
          <option value="tipe">Tipe</option>
          <option value="nama">Nama</option>
          <option value="quantity">Quantity</option>
          <option value="harga">Harga</option>
        </select>
      </div>

      <br />

      <div class="search">
        <input
          v-model="searchValue"
          type="text"
          class="form-control shadow-none"
          id="search"
          placeholder="Cari..."
        />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        :headers="headers"
        :items="spareparts"
        :loading="loading"
        :search-field="searchField"
        :search-value="searchValue"
        :theme-color="baseColor"
        :rows-per-page="10"
        table-class-name="head-table"
        alternating
        show-index
        border-cell
        buttons-pagination
      >
        <template #loading>
          <div class="loader"></div>
        </template>
        <template #empty-message>
          <p>Data tidak ditemukan</p>
        </template>
        <template #items="{ item }">
          <tr>
            <td>{{ item.tipe }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.harga }}</td>
          </tr>
        </template>
        <template #item-action="item">
          <td class="d-flex gap-2">
            <a href="#" class="head-text text-decoration-none" @click="viewModal(item)">Lihat</a>
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
                  <a class="dropdown-item" href="#" @click="addQuantityModal(item)"
                    >Tambah Quantity</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="reduceQuantityModal(item)"
                    >Kurangi Quantity</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="editModal(item)">Ubah</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="deleteModal(item)">Hapus</a>
                </li>
              </ul>
            </div>
          </td>
        </template>
      </EasyDataTable>
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
            <label for="nosparepart" class="form-label fw-bold">No Spareparts</label>
            <input
              v-model="viewSparepartsForm.nosparepart"
              type="text"
              class="form-control shadow-none bg-light"
              id="nosparepart"
              placeholder="Masukan No Spareparts"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="tipe" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="viewSparepartsForm.tipe"
              type="text"
              class="form-control shadow-none bg-light"
              id="tipe"
              placeholder="Masukan Tipe Device"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="nama" class="form-label fw-bold">Nama</label>
            <input
              v-model="viewSparepartsForm.nama"
              type="text"
              class="form-control shadow-none bg-light"
              id="nama"
              placeholder="Masukan Nama"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="quantity" class="form-label fw-bold">Quantity</label>
            <input
              v-model="viewSparepartsForm.quantity"
              type="number"
              class="form-control shadow-none bg-light"
              id="quantity"
              placeholder="Masukan Quantity"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="harga" class="form-label fw-bold">Harga</label>
            <input
              v-model="viewSparepartsForm.harga"
              type="number"
              class="form-control shadow-none bg-light"
              id="harga"
              placeholder="Masukan Harga"
              readonly
            />
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
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <form @submit.prevent="updateSpareparts" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="nosparepart" class="form-label fw-bold">No Spareparts</label>
              <input
                v-model="editSparepartsForm.nosparepart"
                type="text"
                class="form-control shadow-none"
                id="nosparepart"
                placeholder="Masukan No Spareparts"
              />
            </div>
            <div class="mb-3">
              <label for="tipe" class="form-label fw-bold">Tipe Device</label>
              <input
                v-model="editSparepartsForm.tipe"
                type="text"
                class="form-control shadow-none"
                id="tipe"
                placeholder="Masukan Tipe Device"
              />
            </div>
            <div class="mb-3">
              <label for="nama" class="form-label fw-bold">Nama</label>
              <input
                v-model="editSparepartsForm.nama"
                type="text"
                class="form-control shadow-none"
                id="nama"
                placeholder="Masukan Nama"
              />
            </div>
            <div class="mb-3">
              <label for="quantity" class="form-label fw-bold">Quantity</label>
              <input
                v-model="editSparepartsForm.quantity"
                type="number"
                class="form-control shadow-none"
                id="quantity"
                placeholder="Masukan Quantity"
              />
            </div>
            <div class="mb-3">
              <label for="harga" class="form-label fw-bold">Harga</label>
              <input
                v-model="editSparepartsForm.harga"
                type="number"
                class="form-control shadow-none"
                id="harga"
                placeholder="Masukan Harga"
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

  <!-- add Quantity -->
  <div
    class="modal fade"
    id="updateQuantity"
    tabindex="-1"
    aria-labelledby="updateQuantityLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="updateQuantityLabel">Tambah Quantity</h5>
        </div>
        <form @submit.prevent="addQuantity" enctype="multipart/form-data">
          <div class="modal-body d-flex justify-content-center">
            <input
              v-model="updateQuantityForm.quantity"
              class="addquan text-center"
              type="number"
              id="quantity"
              name="quantity"
            />
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-danger btn-sm text-white" data-bs-dismiss="modal">
              Cancel
            </button>
            <button class="btn btn-success btn-sm mb-1 text-white" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Reduce Quantity -->
  <div
    class="modal fade"
    id="reduceQuantity"
    tabindex="-1"
    aria-labelledby="reduceQuantityLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="reduceQuantityLabel">Kurangi Quantity</h5>
        </div>
        <form @submit.prevent="lessQuantity" enctype="multipart/form-data">
          <div class="modal-body d-flex justify-content-center">
            <input
              v-model="reduceQuantityForm.quantity"
              class="addquan text-center"
              type="number"
              id="quantity"
              name="quantity"
            />
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-danger btn-sm text-white" data-bs-dismiss="modal">
              Cancel
            </button>
            <button class="btn btn-success btn-sm mb-1 text-white" type="submit">Submit</button>
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
          <h5 class="modal-title">Hapus Data Firmwares</h5>
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <p>Yakin mau hapus data ini?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="deleteSpareparts">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'

import AddDataSpareparts from '../../components/ModalSpareparts/AddDataSpareparts.vue'

let viewForm
let editForm
let updateQuantity
let reduceQuantity
let deleteForm
const spareparts = ref([])
const viewSparepartsForm = ref({})
const editSparepartsForm = ref({})
const updateQuantityForm = ref({ quantity: '' })
const reduceQuantityForm = ref({ quantity: '' })
const id = ref(null)
const searchField = ref('Cari berdasarkan kolom')
const searchValue = ref('')
const loading = ref(true)

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Tipe', value: 'tipe' },
  { text: 'Nama Device', value: 'nama' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Harga', value: 'harga' },
  { text: 'Action', value: 'action' },
])

onMounted(() => {
  viewForm = new Modal(document.getElementById('viewForm'), {})
  editForm = new Modal(document.getElementById('editForm'), {})
  updateQuantity = new Modal(document.getElementById('updateQuantity'), {})
  reduceQuantity = new Modal(document.getElementById('reduceQuantity'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
})

function viewModal(sparepart) {
  viewSparepartsForm.value = { ...sparepart }
  id.value = sparepart.id
  viewForm.show()
}
function editModal(sparepart) {
  editSparepartsForm.value = { ...sparepart }
  id.value = sparepart.id
  editForm.show()
}
function addQuantityModal(sparepart) {
  updateQuantityForm.value = { ...sparepart, quantity: '' }
  id.value = sparepart.id
  updateQuantity.show()
}
function reduceQuantityModal(sparepart) {
  reduceQuantityForm.value = { ...sparepart, quantity: '' }
  id.value = sparepart.id
  reduceQuantity.show()
}

function deleteModal(sparepart) {
  id.value = sparepart.id
  deleteForm.show()
}

function closeModal() {
  viewForm.hide()
  editForm.hide()
  updateQuantity.hide()
  reduceQuantity.hide()
  deleteForm.hide()
}

const fetchSpareparts = async () => {
  try {
    const response = await axios.get('getspareparts')
    spareparts.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
    showNotification('error', error.response.data.message)
  } finally {
    loading.value = false
  }
}

// Update a service
const updateSpareparts = async () => {
  try {
    const response = await axios.put(`updatespareparts/${id.value}`, editSparepartsForm.value)
    spareparts.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal diubah', error)
    showNotification('error', 'Data gagal diubah.')
    closeModal()
  } finally {
    loading.value = false
  }
}

const addQuantity = async () => {
  try {
    const response = await axios.put(`updatequantity/${id.value}`, {
      quantity: updateQuantityForm.value.quantity,
      add: true,
    })
    spareparts.value = response.data.data
    showNotification('success', response.data.messages)
    closeModal()
  } catch (error) {
    showNotification('error', 'Gagal menambahkan quantity')
    closeModal()
  } finally {
    loading.value = false
  }
}

const lessQuantity = async () => {
  try {
    const response = await axios.put(`updatequantity/${id.value}`, {
      quantity: reduceQuantityForm.value.quantity,
      reduce: true,
    })
    spareparts.value = response.data.data
    showNotification('success', response.data.messages)
    closeModal()
  } catch (error) {
    showNotification('error', 'Jumlah yang dikurangi melebihi quantity')
    closeModal()
  } finally {
    loading.value = false
  }
}

const deleteSpareparts = async () => {
  try {
    const response = await axios.delete(`destroyspareparts/${id.value}`)
    spareparts.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal dihapus', error)
    showNotification('error', 'Data gagal dihapus.')
    closeModal()
  }
}

function showNotification(type, message) {
  Swal.fire({
    icon: type,
    title: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didClose: () => {
      window.location.reload()
    },
  })
}

onMounted(() => {
  fetchSpareparts()
})
</script>

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}

.position-relative {
  position: relative;
}

.btn-clear {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 1.2rem;
  color: #aaa;
  cursor: pointer;
}

.btn-clear:hover {
  color: #000;
}

.addquan {
  width: 20%;
  height: 4rem;
  font-size: 2rem;
}

.head-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
}
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 6px;
  background: conic-gradient(from 135deg at top, currentColor 90deg, #0000 0) 0 calc(50% - 4px) /
      17px 8.5px,
    radial-gradient(
        farthest-side at bottom left,
        #0000 calc(100% - 6px),
        currentColor calc(100% - 5px) 99%,
        #0000
      )
      top right/50% 50% content-box content-box,
    radial-gradient(
        farthest-side at top,
        #0000 calc(100% - 6px),
        currentColor calc(100% - 5px) 99%,
        #0000
      )
      bottom / 100% 50% content-box content-box;
  background-repeat: no-repeat;
  animation: l11 1s infinite linear;
}
@keyframes l11 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
