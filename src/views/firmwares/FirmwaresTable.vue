<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddFirmwares @data-added="refreshList()" />
      </div>
      <div class="others d-flex align-items-center gap-2">
        <SearchFirmwares :onSearch="updateSearch" />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update:options="serverOptions = $event"
        :headers="headers"
        :items="firmwares"
        :loading="loading"
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
          <p>Data not found</p>
        </template>
        <template #items="{ item }">
          <tr>
            <td>{{ item.firmwares_devices_id }}</td>
            <td>{{ item.version }}</td>
            <td>{{ item.androids_id }}</td>
            <td>{{ item.flash }}</td>
            <td>{{ item.ota }}</td>
          </tr>
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a href="#" class="head-text text-decoration-none" @click="editModal(item)">Edit</a>
            <a href="#" class="head-text text-decoration-none" @click="deleteModal(item)">Delete</a>
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
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="updateFirmwares" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="firmwaresDevice" class="form-label fw-bold">Firmwares Device</label>
              <input
                v-model="editFirmwares.firmwares_devices_id"
                type="text"
                class="form-control shadow-none"
                id="firmwaresDevice"
              />
            </div>
            <div class="mb-3">
              <label for="version" class="form-label fw-bold">Version</label>
              <input
                v-model="editFirmwares.version"
                type="text"
                class="form-control shadow-none"
                id="version"
              />
            </div>
            <div class="mb-3">
              <label for="android" class="form-label fw-bold">Android</label>
              <input
                v-model="editFirmwares.androids_id"
                type="text"
                class="form-control shadow-none"
                id="android"
              />
            </div>
            <div class="mb-3">
              <label for="flash" class="form-label fw-bold">Flash Link</label>
              <input
                v-model="editFirmwares.flash"
                type="text"
                class="form-control shadow-none"
                id="flash"
              />
            </div>
            <div class="mb-3">
              <label for="ota" class="form-label fw-bold">OTA Link</label>
              <input
                v-model="editFirmwares.ota"
                type="text"
                class="form-control shadow-none"
                id="ota"
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
          <h5 class="modal-title">Delete Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want delete this data?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="deleteFirmwares">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddFirmwares from '../../components/Firmwares/Modal/AddFirmwares.vue'
import SearchFirmwares from '../../components/Firmwares/SearchFirmwares.vue'
import { mockServerItems, refreshData } from '../../mock/mockFirmwares'

let editForm
let deleteForm
const editFirmwares = ref({})
const loading = ref(true)
const firmwares = ref([])
const id = ref(null)

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Tipe Device', value: 'firmwares_device_id' },
  { text: 'Version', value: 'version' },
  { text: 'Android', value: 'androids_id' },
  { text: 'Flash Link', value: 'flash' },
  { text: 'OTA Link', value: 'ota' },
  { text: 'Action', value: 'action' },
])

const serverItemsLength = ref(10)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'name',
  sortType: 'desc',
  searchTerm: '',
})

const refreshList = () => {
  refreshData()
  loadFromServer()
}

const loadFromServer = async () => {
  loading.value = true
  try {
    const { serverCurrentPageItems, serverTotalItemsLength } = await mockServerItems(
      serverOptions.value,
      token,
    )
    firmwares.value = serverCurrentPageItems
    serverItemsLength.value = serverTotalItemsLength
  } catch (error) {
    console.error('Error loading data', error)
    showToast('Failed to load stocks device data.', 'error')
  } finally {
    loading.value = false
  }
}

const updateSearch = (term) => {
  serverOptions.value.searchTerm = term
  serverOptions.value.page = 1
  loadFromServer()
}

watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true },
)

onMounted(() => {
  editForm = new Modal(document.getElementById('editForm'))
  deleteForm = new Modal(document.getElementById('deleteForm'))
  loadFromServer()
})

const updateFirmwares = async () => {
  try {
    const response = await axios.put(`firmwares/${id.value}`, editFirmwares.value)
    showToast(response.data.message, 'success')
    closeModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.data.message, 'error')
    closeModal()
  }
}

const deleteFirmwares = async () => {
  try {
    const response = await axios.delete(`firmwares/${id.value}`)
    showToast(response.data.message, 'success')
    closeModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    showToast(error.data.message, 'error')
    closeModal()
  }
}

function editModal(firmwares) {
  editFirmwares.value = { ...firmwares }
  id.value = firmwares.id
  editForm.show()
}

function deleteModal(firmwares) {
  id.value = firmwares.id
  deleteForm.show()
}

function closeModal() {
  editForm.hide()
  deleteForm.hide()
}
</script>

<style scoped>
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
