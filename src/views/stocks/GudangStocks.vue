<template>
  <CContainer fluid>
    <div class="d-flex align-items-end justify-content-between">
      <caption class="fw-bold">
        List of Data Stock Gudang
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
          @click="searchGudang"
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
            <th>Serial Number</th>
            <th>Tipe Device</th>
            <th>SKU</th>
            <th>Tanggal Masuk</th>
            <th>Tanggal Keluar</th>
            <th>Pelanggan</th>
            <th>Lokasi</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="stocks.length > 0">
          <tr v-for="stock in stocks" :key="stock.id">
            <td>{{ stock.serialnumber }}</td>
            <td>{{ stock.stocksdevice.name }}</td>
            <td>{{ stock.stockssku.name }}</td>
            <td>{{ formatDate(stock.tanggalmasuk) }}</td>
            <td>{{ formatDate(stock.tanggalkeluar) }}</td>
            <td>{{ stock.pelanggan }}</td>
            <td>{{ stock.lokasi }}</td>
            <td class="d-flex gap-2">
              <a href="#" class="head-text text-decoration-none" @click="viewModal(stock)">Lihat</a>
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
                    <a class="dropdown-item" href="#" @click="editModal(stock)">Ubah</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click="deleteModal(stock)">Hapus</a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="stocks.length === 0">
          <tr>
            <td colspan="8" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="8" class="text-center">Loading...</td>
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
                @click.prevent="fetchStocksGudang(pagination.prev_page_url)"
                >Kembali</a
              >
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.current_page }"
            >
              <a class="page-link shadow-none" href="#" @click.prevent="fetchDataPage(page)">{{
                page
              }}</a>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
              <a
                class="page-link shadow-none"
                href="#"
                @click.prevent="fetchStocksGudang(pagination.next_page_url)"
                >Lanjut</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </CContainer>

  <!-- View Stocks -->
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
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
            <input
              v-model="viewStocksForm.serialnumber"
              type="text"
              class="form-control shadow-none bg-light"
              id="serialnumber"
              readonly
            />
          </div>
          <div class="mb-3" v-if="viewStocksForm.stocksdevice">
            <label for="name" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="viewStocksForm.stocksdevice.name"
              type="text"
              class="form-control shadow-none bg-light"
              id="name"
              readonly
            />
          </div>
          <div class="mb-3" v-if="viewStocksForm.stockssku">
            <label for="name" class="form-label fw-bold">SKU</label>
            <input
              v-model="viewStocksForm.stockssku.name"
              type="text"
              class="form-control shadow-none bg-light"
              id="name"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="noinvoice" class="form-label fw-bold">No Invoice</label>
            <input
              v-model="viewStocksForm.noinvoice"
              type="text"
              class="form-control shadow-none bg-light"
              id="noinvoice"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="fw-bold" for="tanggalmasuk">Tanggal Masuk</label>
            <input
              type="date"
              class="form-control shadow-none bg-light"
              id="tanggalmasuk"
              name="tanggalmasuk"
              v-model="viewStocksForm.tanggalmasuk"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="fw-bold" for="tanggalkeluar">Tanggal Keluar</label>
            <input
              type="date"
              class="form-control shadow-none bg-light"
              id="tanggalkeluar"
              name="tanggalkeluar"
              v-model="viewStocksForm.tanggalkeluar"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
            <input
              v-model="viewStocksForm.pelanggan"
              type="text"
              class="form-control shadow-none bg-light"
              id="pelanggan"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="lokasi" class="form-label fw-bold">Lokasi</label>
            <input
              v-model="viewStocksForm.lokasi"
              type="text"
              class="form-control shadow-none bg-light"
              id="lokasi"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="fw-bold" for="keterangan">Keterangan</label>
            <textarea
              type="text"
              class="form-control shadow-none bg-light"
              id="keterangan"
              name="keterangan"
              v-model="viewStocksForm.keterangan"
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
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <form @submit.prevent="updateService" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="editStocksForm.serialnumber"
                type="text"
                class="form-control shadow-none"
                id="serialnumber"
              />
            </div>
            <div class="mb-3" v-if="editStocksForm.stocksdevice">
              <label class="fw-bold" for="stocksdevice_id">Tipe Device</label>
              <select
                class="form-select form-control-chosen shadow-none"
                name="stocksdevice_id"
                id="stocksdevice_id"
                v-model="editStocksForm.stocksdevice.id"
                @input="(event) => (editStocksForm.stocksdevice_id = event.target.value)"
              >
                <option value="" disabled selected>Pilih Tipe Device</option>
                <option v-for="device in stocksdevice" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div class="mb-3" v-if="editStocksForm.stockssku">
              <label class="fw-bold" for="stocks_sku_id">SKU</label>
              <select
                class="form-select form-control-chosen shadow-none"
                name="stocks_sku_id"
                id="stocks_sku_id"
                v-model="editStocksForm.stockssku.id"
                @input="(event) => (editStocksForm.stocks_sku_id = event.target.value)"
              >
                <option value="" disabled selected>Pilih SKU</option>
                <option v-for="device in stockssku" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="noinvoice" class="form-label fw-bold">No Invoice</label>
              <input
                v-model="editStocksForm.noinvoice"
                type="text"
                class="form-control shadow-none"
                id="noinvoice"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="tanggalmasuk">Tanggal Masuk</label>
              <input
                type="date"
                class="form-control shadow-none"
                id="tanggalmasuk"
                name="tanggalmasuk"
                v-model="editStocksForm.tanggalmasuk"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="tanggalkeluar">Tanggal Keluar</label>
              <input
                type="date"
                class="form-control shadow-none"
                id="tanggalkeluar"
                name="tanggalkeluar"
                v-model="editStocksForm.tanggalkeluar"
              />
            </div>
            <div class="mb-3">
              <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
              <input
                v-model="editStocksForm.pelanggan"
                type="text"
                class="form-control shadow-none"
                id="pelanggan"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="lokasi">Lokasi</label>
              <select
                class="form-select shadow-none"
                name="lokasi"
                id="lokasi"
                v-model="editStocksForm.lokasi"
              >
                <option value="" disabled selected>Pilih Lokasi</option>
                <option value="A01">A01</option>
                <option value="A02">A02</option>
                <option value="B01">B01</option>
                <option value="B02">B02</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="keterangan">Keterangan</label>
              <textarea
                type="text"
                class="form-control shadow-none"
                id="keterangan"
                name="keterangan"
                v-model="editStocksForm.keterangan"
              ></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="d-flex gap-2">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="Gudang"
                    value="Gudang"
                    v-model="editStocksForm.status"
                  />
                  <label class="form-check-label" for="Gudang">Gudang</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="Diservice"
                    value="Diservice"
                    v-model="editStocksForm.status"
                  />
                  <label class="form-check-label" for="Diservice">Diservice</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="Dipinjam"
                    value="Dipinjam"
                    v-model="editStocksForm.status"
                  />
                  <label class="form-check-label" for="Dipinjam">Dipinjam</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="Terjual"
                    value="Terjual"
                    v-model="editStocksForm.status"
                  />
                  <label class="form-check-label" for="Terjual">Terjual</label>
                </div>
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
          <h5 class="modal-title">Hapus Service</h5>
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
          <button type="button" class="btn btn-danger text-white" @click="deleteService">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

// Define reactive variables
let viewForm
let editForm
let deleteForm
const stocks = ref([])
const viewStocksForm = ref({})
const editStocksForm = ref({})
const id = ref(null)
const stocksdevice = ref([])
const stockssku = ref([])
const pagination = ref({})
const pageSize = 3
const searchQuery = ref('')

// Initialize modals on mount
onMounted(() => {
  viewForm = new Modal(document.getElementById('viewForm'), {})
  editForm = new Modal(document.getElementById('editForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
})

// Show modals
function viewModal(service) {
  viewStocksForm.value = { ...service }
  id.value = service.id
  viewForm.show()
}

function editModal(service) {
  editStocksForm.value = { ...service, status: service.status || '' }
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

const fetchStocksGudang = async (url = 'stocks/gudang') => {
  try {
    const response = await axios.get(url, {
      params: {
        search: searchQuery.value,
      },
    })
    stocks.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchDataPage = (page) => {
  const url = `stocks/gudang?page=${page}`
  fetchStocksGudang(url)
}

const fetchDevices = async () => {
  try {
    const response = await axios.get('getliststocks')
    stocksdevice.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

const fetchStocksSku = async () => {
  try {
    const response = await axios.get('getliststockssku')
    stockssku.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

// Update a service
const updateService = async () => {
  try {
    const response = await axios.put(`updatestocks/${id.value}`, editStocksForm.value)
    stocks.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal diubah', error)
    showNotification('error', 'Data gagal diubah.')
    closeModal()
  }
}

// Delete a service
const deleteService = async () => {
  try {
    const response = await axios.delete(`destroystocks/${id.value}`)
    stocks.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Failed to delete service', error)
    showNotification('error', 'Failed to delete service.')
    closeModal()
  }
}

const searchGudang = () => {
  fetchStocksGudang()
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
  Swal.fire({
    icon: type,
    title: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didClose: () => {
      window.location.reload()
    },
  })
}

// Fetch initial data
onMounted(() => {
  fetchStocksGudang()
  fetchDevices()
  fetchStocksSku()
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
</style>
