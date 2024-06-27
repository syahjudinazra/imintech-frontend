<template>
  <CContainer fluid>
    <div class="d-flex align-items-end justify-content-between">
      <caption class="fw-bold">
        List of Data Antrian Pelanggan
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
          @click="searchServices"
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
            <th>Tanggal Masuk</th>
            <th>Serial Number</th>
            <th>Pelanggan</th>
            <th>Device</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="services.length > 0">
          <tr v-for="(service, index) in services" :key="service.id">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(service.tanggalmasuk) }}</td>
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
                    <a class="dropdown-item" href="#" @click="salinModal(service)">Salin</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click="moveModal(service)">Pindah</a>
                  </li>
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
        <tbody v-else-if="services.length === 0">
          <tr>
            <td colspan="6" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="text-center">Loading...</td>
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
                @click.prevent="fetchAntrianPelanggan(pagination.prev_page_url)"
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
                @click.prevent="fetchAntrianPelanggan(pagination.next_page_url)"
                >Lanjut</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </CContainer>

  <!-- Copy Text Modal -->
  <div
    class="modal fade"
    id="salinForm"
    tabindex="-1"
    role="dialog"
    aria-labelledby="salinForm_Label"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="salinForm_Label">Copy Data</h5>
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body bg-light">
          <div class="highlight float-end">
            <button @click="copyData" type="button" class="copyClipboard btn btn-secondary">
              <i class="fa-solid fa-clone mr-2"></i>Copy
            </button>
          </div>
          <pre id="salinData" class="highlight mt-4 d-flex flex-column">
            <span>{{ salinServicesForm.pelanggan }}</span>
            <span>{{ salinServicesForm.device }}</span>
            <span>{{ salinServicesForm.serialnumber }}</span>
            <span>*Status :* {{ salinServicesForm.status }}</span>
            <span> </span>
            <span class="text-wrap">*Kerusakan :* <br /> {{ salinServicesForm.kerusakan }}</span>
            <span> </span>
            <span class="text-wrap">*Catatan :* <br /> {{ salinServicesForm.catatan }}</span>
          </pre>
        </div>
      </div>
    </div>
  </div>
  <!-- End Copy Text Modal -->

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
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="pemilik" class="form-label fw-bold">Pemilik</label>
            <input
              v-model="viewServicesForm.pemilik"
              type="text"
              class="form-control shadow-none bg-light"
              id="pemilik"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
            <input
              v-model="viewServicesForm.pelanggan"
              type="text"
              class="form-control shadow-none bg-light"
              id="pelanggan"
              readonly
            />
          </div>
          <div class="mb-3" v-if="viewServicesForm.servicesdevice">
            <label for="name" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="viewServicesForm.servicesdevice.name"
              type="text"
              class="form-control shadow-none bg-light"
              id="name"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
            <input
              v-model="viewServicesForm.serialnumber"
              type="text"
              class="form-control shadow-none bg-light"
              id="serialnumber"
              readonly
            />
          </div>
          <div class="mb-3">
            <label for="pemakaian" class="form-label fw-bold">Pemakaian</label>
            <input
              v-model="viewServicesForm.pemakaian"
              type="text"
              class="form-control shadow-none bg-light"
              id="pemakaian"
              readonly
            />
          </div>
          <div class="form-group mb-3">
            <label class="fw-bold" for="kerusakan">Kerusakan</label>
            <textarea
              type="text"
              class="form-control shadow-none bg-light"
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
              class="form-control shadow-none bg-light"
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
              class="form-control shadow-none bg-light"
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
              <label class="fw-bold" for="servicesdevice_id">Tipe Device</label>
              <select
                class="form-select form-control-chosen shadow-none"
                name="servicesdevice_id"
                id="servicesdevice_id"
                v-model="editServicesForm.servicesdevice.id"
                @input="(event) => (editServicesForm.servicesdevice_id = event.target.value)"
              >
                <option value="" disabled selected>Pilih Tipe Device</option>
                <option v-for="device in servicesdevice" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
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
            <div class="form-group mb-3">
              <label class="fw-bold" for="pemakaian">Lama Pemakaian</label>
              <select
                class="form-select shadow-none"
                name="pemakaian"
                id="pemakaian"
                v-model="editServicesForm.pemakaian"
              >
                <option value="" disabled selected>Pilih Lama Pemakaian</option>
                <option value="Baru Di Unboxing">Baru Di Unboxing</option>
                <option value="7 Hari Kurang">7 Hari Kurang</option>
                <option value="1 Tahun Kurang">1 Tahun Kurang</option>
                <option value="1 Tahun Lebih">1 Tahun Lebih</option>
              </select>
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
            <div class="form-group mb-3" hidden>
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="status"
                  v-model="editServicesForm.status"
                  :true-value="'Antrian'"
                  :false-value="'Null'"
                  checked
                />
                <label class="form-check-label" for="status">Antrian</label>
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
          <button
            type="button"
            class="btn-close shadow-none"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <form @submit.prevent="moveService" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="moveServicesForm.serialnumber"
                type="text"
                class="form-control shadow-none bg-light"
                id="serialnumber"
                readonly
              />
            </div>
            <div class="mb-3">
              <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
              <input
                v-model="moveServicesForm.pelanggan"
                type="text"
                class="form-control shadow-none bg-light"
                id="pelanggan"
                readonly
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="kerusakan">Kerusakan</label>
              <textarea
                type="text"
                class="form-control shadow-none bg-light"
                id="kerusakan"
                name="kerusakan"
                v-model="moveServicesForm.kerusakan"
                readonly
              ></textarea>
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="perbaikan">Perbaikan</label>
              <textarea
                type="text"
                class="form-control shadow-none"
                id="perbaikan"
                name="perbaikan"
                v-model="moveServicesForm.perbaikan"
                placeholder="Masukan Perbaikan"
              ></textarea>
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="teknisi">Teknisi</label>
              <select
                class="form-select shadow-none"
                id="teknisi"
                v-model="moveServicesForm.teknisi"
              >
                <option value="" disabled>Pilih Teknisi</option>
                <option value="Alfian">Alfian</option>
                <option value="Ozi">Ozi</option>
                <option value="Timo">Timo</option>
                <option value="Andre">Andre</option>
                <option value="Lainya">Lainya</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="nosparepart" class="form-label fw-bold">No SparePart</label>
              <input
                v-model="moveServicesForm.nosparepart"
                type="text"
                class="form-control shadow-none"
                id="nosparepart"
                placeholder="Masukan No SparePart"
              />
            </div>
            <div class="mb-3">
              <label for="snkanibal" class="form-label fw-bold">SN Kanibal</label>
              <input
                v-model="moveServicesForm.snkanibal"
                type="text"
                class="form-control shadow-none"
                id="snkanibal"
                placeholder="Masukan SN Kanibal"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="tanggalselesai">Tanggal Selesai</label>
              <input
                type="date"
                class="form-control shadow-none"
                id="tanggalselesai"
                name="tanggalselesai"
                v-model="moveServicesForm.tanggalselesai"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="catatan">Catatan</label>
              <textarea
                type="text"
                class="form-control shadow-none"
                id="catatan"
                name="catatan"
                v-model="moveServicesForm.catatan"
                placeholder="Masukan Catatan"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="pemilik" class="form-label fw-bold">Pemilik</label>
              <input
                v-model="moveServicesForm.pemilik"
                type="text"
                class="form-control shadow-none"
                id="pemilik"
                placeholder="Masukan Pemilik"
              />
            </div>
            <div class="mb-3" v-if="moveServicesForm.servicesdevice">
              <label class="fw-bold" for="servicesdevice_id">Tipe Device</label>
              <select
                class="form-select shadow-none"
                name="servicesdevice_id"
                id="servicesdevice_id"
                v-model="moveServicesForm.servicesdevice.id"
                @input="(event) => (moveServicesForm.servicesdevice_id = event.target.value)"
              >
                <option value="" disabled selected>Pilih Tipe Device</option>
                <option v-for="device in servicesdevice" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="pemakaian">Lama Pemakaian</label>
              <select
                class="form-select shadow-none"
                id="pemakaian"
                v-model="moveServicesForm.pemakaian"
              >
                <option value="" disabled selected>Pilih Lama Pemakaian</option>
                <option value="Baru Di Unboxing">Baru Di Unboxing</option>
                <option value="7 Hari Kurang">7 Hari Kurang</option>
                <option value="1 Tahun Kurang">1 Tahun Kurang</option>
                <option value="1 Tahun Lebih">1 Tahun Lebih</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="tanggalmasuk">Tanggal Masuk</label>
              <input
                type="date"
                class="form-control shadow-none"
                id="tanggalmasuk"
                name="tanggalmasuk"
                v-model="moveServicesForm.tanggalmasuk"
              />
            </div>
            <div class="form-group mb-3">
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="status"
                  v-model="moveServicesForm.status"
                  :true-value="'Validasi'"
                  :false-value="'Antrian'"
                  checked
                />
                <label class="form-check-label" for="status">Validasi</label>
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
let salinForm
let viewForm
let editForm
let moveForm
let deleteForm
const services = ref([])
const salinServicesForm = ref({})
const viewServicesForm = ref({})
const editServicesForm = ref({})
const moveServicesForm = ref({})
const id = ref(null)
const servicesdevice = ref([])
const pagination = ref({})
const pageSize = 3
const searchQuery = ref('')

// Initialize modals on mount
onMounted(() => {
  salinForm = new Modal(document.getElementById('salinForm'), {})
  viewForm = new Modal(document.getElementById('viewForm'), {})
  editForm = new Modal(document.getElementById('editForm'), {})
  moveForm = new Modal(document.getElementById('moveForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
})

// Show modals
function salinModal(service) {
  salinServicesForm.value = { ...service }
  id.value = service.id
  salinForm.show()
}

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

function moveModal(service) {
  moveServicesForm.value = { ...service }
  id.value = service.id
  moveForm.show()
}

function deleteModal(service) {
  id.value = service.id
  deleteForm.show()
}

function closeModal() {
  salinForm.hide()
  editForm.hide()
  moveForm.hide()
  viewForm.hide()
  deleteForm.hide()
}

const fetchAntrianPelanggan = async (url = 'antrianPelanggan') => {
  try {
    const response = await axios.get(url, {
      params: {
        search: searchQuery.value,
      },
    })
    services.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchDataPage = (page) => {
  const url = `antrianPelanggan?page=${page}`
  fetchAntrianPelanggan(url)
}

const fetchDevices = async () => {
  try {
    const response = await axios.get('getlistservices')
    servicesdevice.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

// Update a service
const updateService = async () => {
  try {
    const response = await axios.put(`updateservices/${id.value}`, editServicesForm.value)
    services.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal diubah', error)
    showNotification('error', 'Data gagal diubah.')
    closeModal()
  }
}

// move a service
const moveService = async () => {
  try {
    const response = await axios.put(`moveservices/${id.value}`, moveServicesForm.value)
    services.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal dipindahkan', error)
    showNotification('error', 'Data gagal dipindahkan.')
    closeModal()
  }
}

// Delete a service
const deleteService = async () => {
  try {
    const response = await axios.delete(`destroyservices/${id.value}`)
    services.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Failed to delete service', error)
    showNotification('error', 'Failed to delete service.')
    closeModal()
  }
}

// Copy Text
const copyData = () => {
  const targetElement = document.querySelector('#salinData')

  if (targetElement) {
    const textToCopy = targetElement.innerText || targetElement.textContent

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard:', textToCopy)

        const button = document.querySelector('.copyClipboard')
        if (button) {
          button.textContent = 'Copied'
          button.disabled = true
        }
      })
      .catch((err) => {
        console.error('Unable to copy to clipboard.', err)
      })
  }
}

const searchServices = () => {
  fetchAntrianPelanggan()
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
  fetchAntrianPelanggan()
  fetchDevices()
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
