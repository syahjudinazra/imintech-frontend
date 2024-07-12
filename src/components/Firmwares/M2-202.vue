<template>
  <CContainer fluid>
    <div class="firmwares-title">
      <h2>Firmwares</h2>
    </div>

    <div class="d-flex">
      <SidebarItem />
      <div class="sidebar-content">
        <EasyDataTable
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :headers="headers"
          :items="firmwares"
          :loading="loading"
          :search-field="searchField"
          :search-value="searchValue"
          :theme-color="baseColor"
          :rows-per-page="3"
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
              <td>{{ item.versi }}</td>
              <td>{{ item.android }}</td>
              <td>{{ item.flash }}</td>
              <td>{{ item.ota }}</td>
            </tr>
          </template>
          <template #item-action="item">
            <div class="d-flex gap-2">
              <a href="#" class="head-text text-decoration-none" @click="editModal(item)">Ubah</a>
              <a href="#" class="head-text text-decoration-none" @click="deleteModal(item)"
                >Hapus</a
              >
            </div>
          </template>
        </EasyDataTable>
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
          <form @submit.prevent="updateFirmwares" enctype="multipart/form-data">
            <div class="modal-body">
              <div class="mb-3">
                <label for="tipe" class="form-label fw-bold">Tipe Device</label>
                <input
                  v-model="editFirmwaresForm.tipe"
                  type="text"
                  class="form-control shadow-none"
                  id="tipe"
                  placeholder="Masukan Tipe Device"
                />
              </div>
              <div class="mb-3">
                <label for="versi" class="form-label fw-bold">Versi</label>
                <input
                  v-model="editFirmwaresForm.versi"
                  type="text"
                  class="form-control shadow-none"
                  id="versi"
                  placeholder="Masukan Versi"
                />
              </div>
              <div class="mb-3">
                <label for="android" class="form-label fw-bold">Android</label>
                <input
                  v-model="editFirmwaresForm.android"
                  type="text"
                  class="form-control shadow-none"
                  id="android"
                  placeholder="Masukan Android"
                />
              </div>
              <div class="mb-3">
                <label for="flash" class="form-label fw-bold">Flash</label>
                <input
                  v-model="editFirmwaresForm.flash"
                  type="text"
                  class="form-control shadow-none"
                  id="flash"
                  placeholder="Masukan flash"
                />
              </div>
              <div class="mb-3">
                <label for="ota" class="form-label fw-bold">Ota</label>
                <input
                  v-model="editFirmwaresForm.ota"
                  type="text"
                  class="form-control shadow-none"
                  id="ota"
                  placeholder="Masukan Ota"
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
            <button type="button" class="btn btn-danger text-white" @click="deleteFirmware">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </CContainer>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'
import { mockServerItems } from '../../mock'

// References
let editForm
let deleteForm
const firmwares = ref([])
const loading = ref(true)
const editFirmwaresForm = ref({})
const id = ref(null)

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Tipe', value: 'tipe' },
  { text: 'Versi', value: 'versi' },
  { text: 'Android', value: 'android' },
  { text: 'Flash', value: 'flash' },
  { text: 'Ota', value: 'ota' },
  { text: 'Action', value: 'action' },
])

const serverItemsLength = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 3,
  sortBy: 'tipe',
  sortType: 'desc',
})

const loadFromServer = async () => {
  loading.value = true
  const { serverCurrentPageItems, serverTotalItemsLength } = await mockServerItems(
    serverOptions.value,
  )
  firmwares.value = serverCurrentPageItems
  serverItemsLength.value = serverTotalItemsLength
  loading.value = false
}

// initial load
loadFromServer()

watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true },
)

// Lifecycle hooks
onMounted(() => {
  editForm = new Modal(document.getElementById('editForm'), {})
  deleteForm = new Modal(document.getElementById('deleteForm'), {})
})

const updateFirmwares = async () => {
  try {
    const formData = new FormData()
    formData.append('tipe', editFirmwaresForm.value.tipe)
    formData.append('versi', editFirmwaresForm.value.versi)
    formData.append('android', editFirmwaresForm.value.android)
    formData.append('flash', editFirmwaresForm.value.flash)
    formData.append('ota', editFirmwaresForm.value.ota)
    formData.append('kategori', editFirmwaresForm.value.kategori)
    if (editFirmwaresForm.value.gambar) {
      formData.append('gambar', editFirmwaresForm.value.gambar)
    }

    const response = await axios.put(`updatefirmwares/${id.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    firmwares.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal diubah', error)
    showNotification('error', 'Data gagal diubah.')
    closeModal()
  }
}

const deleteFirmware = async () => {
  try {
    const response = await axios.delete(`destroyfirmwares/${id.value}`)
    firmwares.value = response.data.data
    showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal dihapus', error)
    showNotification('error', 'Data gagal dihapus.')
    closeModal()
  }
}

function editModal(firmware) {
  editFirmwaresForm.value = { ...firmware }
  id.value = firmware.id
  editForm.show()
}

function deleteModal(firmware) {
  id.value = firmware.id
  deleteForm.show()
}

function closeModal() {
  editForm.hide()
  deleteForm.hide()
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
</script>

<style scoped>
.firmwares-title {
  margin-bottom: 20px;
}

.sidebar-content {
  flex-grow: 1;
  padding: 20px;
}
</style>
