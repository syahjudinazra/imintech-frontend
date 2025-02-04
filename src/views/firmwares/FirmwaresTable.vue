<template>
  <div class="container-fluid" v-if="userRole === 'superadmin'">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddFirmwares v-if="canCreate" @data-added="refreshList()" />
      </div>
      <div class="others d-flex align-items-center gap-2">
        <ExportFirmwares v-if="canExport" />
        <ImportFirmwares v-if="canImport" />
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
        table-class-name="customize-table"
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
        <template #item-flash="item">
          <div class="link-container">
            <a :href="item.flash" target="_blank" class="truncated-link" :title="item.flash">
              {{ formatLink(item.flash) }}
            </a>
          </div>
        </template>
        <template #item-ota="item">
          <div class="link-container">
            <a :href="item.ota" target="_blank" class="truncated-link" :title="item.ota">
              {{ formatLink(item.ota) }}
            </a>
          </div>
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a
              v-if="canEdit"
              href="#"
              class="head-text text-decoration-none"
              @click="editModal(item)"
              >Edit</a
            >
            <a
              v-if="canDelete"
              href="#"
              class="head-text text-decoration-none"
              @click="deleteModal(item)"
              >Delete</a
            >
          </div>
        </template>
      </EasyDataTable>
    </div>
  </div>
  <p v-else-if="userRole === ''">Loading...</p>
  <StatusPage v-else />

  <EditFirmwares
    ref="editModalRef"
    :firmware="editFirmwares"
    :firmwares-device="firmwaresDevice"
    :androids="androids"
    :loading="loading"
    @update="updateFirmwares"
    @close="closeEditModal"
  />

  <DeleteFirmwares ref="deleteModalRef" @delete="deleteFirmwares" @close="closeDeleteModal" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddFirmwares from '../../components/Firmwares/Modal/AddFirmwares.vue'
import EditFirmwares from '../../components/Firmwares/Modal/EditFirmwares.vue'
import DeleteFirmwares from '../../components/Firmwares/Modal/DeleteFirmwares.vue'
import Search from '../../components/Layouts/SearchAll'
import ExportFirmwares from '../../components/Firmwares/Excel/ExportFirmwares.vue'
import ImportFirmwares from '../../components/Firmwares/Excel/ImportFirmwares.vue'
import StatusPage from '../../components/StatusPage/404Page.vue'
import { mockServerItems } from '../../mock/mockFirmwares'

const id = ref(null)
const firmwares = ref([])
const firmwaresDevice = ref([])
const androids = ref([])
const editModalRef = ref(null)
const deleteModalRef = ref(null)
const editFirmwares = ref({})
const loading = ref(false)
const userPermissions = ref([])
const userRole = ref('')

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Devices', value: 'firmwares_devices_id' },
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
  loadFromServer()
}

const loadFromServer = async () => {
  loading.value = true
  try {
    const { serverCurrentPageItems, serverTotalItemsLength } = await mockServerItems(
      serverOptions.value,
      localStorage.getItem('token'),
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
  fetchUserPermissions()
  fetchUserRole()
})

const formatLink = (url) => {
  if (!url) return ''
  if (url.length <= 30) return url

  // Extract filename from URL
  const filename = url.split('/').pop()
  if (!filename) return url.substring(0, 27) + '...'

  // If filename is too long, truncate it
  if (filename.length > 20) {
    return '.../' + filename.substring(0, 17) + '...'
  }

  return '.../' + filename
}

async function fetchUserPermissions() {
  try {
    const response = await axios.get('user')
    const permissions = response.data.permissions || []
    userPermissions.value = permissions.map((permission) => permission.name)
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    showToast('Failed to fetch user permissions.', 'error')
  }
}

async function fetchUserRole() {
  try {
    const response = await axios.get('user')
    const roles = response.data.roles || []
    userRole.value = roles.some((role) => role.name === 'superadmin') ? 'superadmin' : 'user'
  } catch (error) {
    console.error('Error fetching user roles:', error)
  }
}

// Add permission check utility
const checkPermission = (permissionName) => {
  try {
    const userData = JSON.parse(localStorage.getItem('users'))
    if (!userData?.permissions) return false

    // Check if the permission exists
    return userData.permissions.some(
      (permission) => permission.name.toLowerCase() === permissionName.toLowerCase(),
    )
  } catch (error) {
    console.error('Error checking permissions:', error)
    return false
  }
}

// Create computed property for permission
const canCreate = computed(() => checkPermission('Create Firmwares'))
const canEdit = computed(() => checkPermission('Edit Firmwares'))
const canDelete = computed(() => checkPermission('Delete Firmwares'))
const canExport = computed(() => checkPermission('Export Firmwares'))
const canImport = computed(() => checkPermission('Import Firmwares'))

// Generic function to fetch all data
const fetchAllData = async (endpoint, currentPage = 1, allData = []) => {
  try {
    const response = await axios.get(`${endpoint}`, {
      params: {
        page: currentPage,
        rowsPerPage: 300,
        sortBy: 'id',
        sortType: 'asc',
      },
    })

    const { data, total } = response.data
    const combinedData = [...allData, ...data]

    // Calculate if need more pages
    const totalPages = Math.ceil(total / 100)

    if (currentPage < totalPages) {
      return await fetchAllData(endpoint, currentPage + 1, combinedData)
    }

    return combinedData
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

const fetchFirmwaresDevice = async () => {
  try {
    firmwaresDevice.value = await fetchAllData('firmwares-device')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchAndroid = async () => {
  try {
    androids.value = await fetchAllData('android')
  } catch (error) {
    console.error('Data not found', error)
  }
}

const updateFirmwares = async (updatedFirmware) => {
  try {
    loading.value = true
    const firmwareToUpdate = {
      ...updatedFirmware,
      firmwares_devices_id: parseInt(updatedFirmware.firmwares_devices_id),
      androids_id: parseInt(updatedFirmware.androids_id),
      android: updatedFirmware.android || updatedFirmware.androids_id,
    }

    const changedFields = Object.keys(updatedFirmware).reduce((acc, key) => {
      if (updatedFirmware[key] !== undefined) {
        acc[key] = firmwareToUpdate[key]
      }
      return acc
    }, {})

    const response = await axios.put(`firmwares/${id.value}`, changedFields)
    showToast(response.data.message, 'success')
    closeEditModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.response?.data?.message || 'Failed to update firmware', 'error')
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
  console.log('Firmware object received:', firmware)

  if (!firmware) {
    console.error('Firmware object is null or undefined')
    showToast('Unable to edit firmware: Invalid data', 'error')
    return
  }

  // Ensure we're working with IDs, not names
  editFirmwares.value = {
    ...firmware,
    firmwares_devices_id: firmware.firmwares_devices_id,
    androids_id: firmware.androids_id,
  }
  id.value = firmware.id

  console.log('editFirmwares.value set to:', editFirmwares.value)
  console.log('id.value set to:', id.value)

  editModalRef.value.showModal()
}
function deleteModal(firmware) {
  deleteModalRef.value.showModal(firmware)
}

const closeEditModal = () => {
  if (editModalRef.value) {
    editModalRef.value.hideModal()
  }
}

function closeDeleteModal() {
  deleteModalRef.value.hideModal()
}
</script>

<style scoped>
.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
}
input:focus,
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
