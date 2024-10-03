<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddFirmwares @data-added="refreshList()" />
      </div>
      <div class="others d-flex align-items-center gap-2">
        <Search :onSearch="updateSearch" />
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
            <td>{{ item.firmware_devices_id }}</td>
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

  <EditFirmwares
    ref="editModalRef"
    :firmware="editFirmwares"
    :firmwares-device="firmwaresDevice"
    :androids="androids"
    @update="updateFirmwares"
    @close="closeEditModal"
  />

  <DeleteFirmwares ref="deleteModalRef" @delete="deleteFirmwares" @close="closeDeleteModal" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddFirmwares from '../../components/Firmwares/Modal/AddFirmwares.vue'
import EditFirmwares from '../../components/Firmwares/Modal/EditFirmwares.vue'
import DeleteFirmwares from '../../components/Firmwares/Modal/DeleteFirmwares.vue'
import Search from '../../components/Layouts/SearchAll'
import { mockServerItems, refreshData } from '../../mock/mockFirmwares'

const editModalRef = ref(null)
const deleteModalRef = ref(null)
const editFirmwares = ref({})
const loading = ref(true)
const firmwares = ref([])
const id = ref(null)
const firmwaresDevice = ref([])
const androids = ref([])

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Tipe', value: 'firmwares_devices_id' },
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
  loadFromServer()
  fetchFirmwaresDevice()
  fetchAndroid()
})

const fetchFirmwaresDevice = async () => {
  try {
    const response = await axios.get('firmwares-device')
    firmwaresDevice.value = response.data.firmwaresdevice
  } catch (error) {
    console.error('Data not found', error)
  }
}

const fetchAndroid = async () => {
  try {
    const response = await axios.get('android')
    androids.value = response.data.android
  } catch (error) {
    console.error('Data not found', error)
  }
}

const updateFirmwares = async (updatedFirmware) => {
  try {
    const response = await axios.put(`firmwares/${id.value}`, updatedFirmware)
    showToast(response.data.message, 'success')
    closeEditModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.data.message, 'error')
    closeEditModal()
  }
}

const deleteFirmwares = async (firmwareId) => {
  try {
    const response = await axios.delete(`firmwares/${firmwareId}`)
    showToast(response.data.message || 'Firmware deleted successfully', 'success')
    closeDeleteModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while deleting the firmware'
    showToast(errorMessage, 'error')
  } finally {
    closeDeleteModal()
  }
}

function editModal(firmware) {
  editFirmwares.value = { ...firmware }
  id.value = firmware.id
  editModalRef.value.showModal()
}

function deleteModal(firmware) {
  deleteModalRef.value.showModal(firmware)
}

function closeEditModal() {
  editModalRef.value.hideModal()
}

function closeDeleteModal() {
  deleteModalRef.value.hideModal()
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
