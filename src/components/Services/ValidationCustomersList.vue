<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import ViewValidation from './Modal/ViewValidation.vue'
import MoveValidationCustomers from '../Services/Modal/Customers/MoveValidationCustomers.vue'
import EditValidationCustomers from '../Services/Modal/Customers/EditValidationCustomers.vue'
import DeleteServices from '../Services/Modal/DeleteServices.vue'
import Search from '../Layouts/SearchAll.vue'
import ProcessNavigation from './etc/ProcessNavigation.vue'
import { mockServerItems } from '../../mock/mockValidationCustomers'

// Refs
const id = ref(null)
const services = ref([])
const servicesDevice = ref([])
const sparepartRequests = ref([])
const usages = ref([])
const technicians = ref([])
const moveModalRef = ref(null)
const viewModalRef = ref(null)
const editModalRef = ref(null)
const deleteModalRef = ref(null)
const viewService = ref({})
const moveService = ref({})
const editService = ref({})
const loading = ref(true)

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = [
  { text: 'Date of Entry', value: 'date_in_services' },
  { text: 'Serial number', value: 'serial_number' },
  { text: 'Customers', value: 'customers' },
  { text: 'Device type', value: 'services_devices_id' },
  { text: 'Action', value: 'action' },
]
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const serverItemsLength = ref(10)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'name',
  sortType: 'desc',
  searchTerm: '',
})

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
const canView = computed(() => checkPermission('View Services'))
const canEdit = computed(() => checkPermission('Edit Validation'))
const canMove = computed(() => checkPermission('Move Validation'))
const canDelete = computed(() => checkPermission('Delete Services'))

const formatDate = (date) => {
  if (!date) return '-'
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return '-'
    const dayName = dayNames[dateObj.getDay()]
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${dayName}, ${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

const refreshList = () => {
  loadFromServer()
}

const loadFromServer = async () => {
  loading.value = true
  try {
    const { serverCurrentPageItems, serverTotalItemsLength } = await mockServerItems(
      serverOptions.value,
      token,
    )
    services.value = serverCurrentPageItems
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

const handleOptionsUpdate = (newOptions) => {
  serverOptions.value = newOptions
}

watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true },
)

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

const fetchServicesDevice = async () => {
  try {
    servicesDevice.value = await fetchAllData('services-device')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchUsages = async () => {
  try {
    usages.value = await fetchAllData('usages')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch usages.', 'error')
  }
}

const fetchTechnicians = async () => {
  try {
    technicians.value = await fetchAllData('technician')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch technician.', 'error')
  }
}

const fetchSparepartRequests = async (serviceId) => {
  try {
    const response = await axios.get(`services/${serviceId}/sparepart-requests`)
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch sparepart requests:', error)
    showToast('Failed to fetch sparepart requests', 'error')
    return []
  }
}

const updateServices = async (updatedServices) => {
  try {
    const response = await axios.put(`services/${id.value}`, updatedServices)
    showToast(response.data.message, 'success')
    closeEditModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.response?.data?.message || 'Update failed', 'error')
  }
}

const moveServices = async (formData) => {
  try {
    const response = await axios.post(`services-move/${id.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    showToast(response.data.message, 'success')
    closeMoveModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to move', error)
    showToast(error.response?.data?.message || 'Move failed', 'error')
  }
}

const deleteServices = async () => {
  try {
    if (!id.value) {
      showToast('No service selected for deletion', 'error')
      return
    }

    const response = await axios.delete(`services/${id.value}`)
    showToast(response.data.message, 'success')
    refreshList()
    closeDeleteModal()
  } catch (error) {
    console.error('Data failed to delete', error)
    showToast(error.response?.data?.message || 'Delete failed', 'error')
  }
}

const viewModal = async (service) => {
  viewService.value = { ...service }
  id.value = service.id

  // Fetch sparepart requests for this service
  const requests = await fetchSparepartRequests(service.id)
  sparepartRequests.value = requests

  viewModalRef.value.showModal()
}

const moveModal = (service) => {
  moveService.value = { ...service }
  id.value = service.id
  moveModalRef.value.showModal()
}

const editModal = (service) => {
  editService.value = { ...service }
  id.value = service.id
  editModalRef.value.showModal()
}

const deleteModal = (service) => {
  id.value = service.id
  deleteModalRef.value.showModal()
}

const closeViewModal = () => {
  viewModalRef.value.hideModal()
}

const closeMoveModal = () => {
  moveModalRef.value.hideModal()
}

const closeEditModal = () => {
  editModalRef.value.hideModal()
}

const closeDeleteModal = () => {
  if (deleteModalRef.value) {
    deleteModalRef.value.hideModal()
  }
  id.value = null
}

onMounted(() => {
  loadFromServer()
  fetchServicesDevice()
  fetchUsages()
  fetchTechnicians()
})
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex gap-2 justify-content-between align-items-center">
      <ProcessNavigation />
      <div class="add-button"></div>
      <div class="others d-flex align-items-center gap-2">
        <Search :onSearch="updateSearch" />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update:options="handleOptionsUpdate"
        :headers="headers"
        :items="services"
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
        <template #item-date_in_services="{ date_in_services }">
          {{ formatDate(date_in_services) }}
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a
              v-if="canView"
              href="#"
              class="head-text text-decoration-none"
              @click.prevent="viewModal(item)"
              >View</a
            >
            <div class="btn-group dropend">
              <a
                type="button"
                class="text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </a>
              <ul class="dropdown-menu">
                <a
                  v-if="canEdit"
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click.prevent="editModal(item)"
                  >Edit</a
                >
                <a
                  v-if="canMove"
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click.prevent="moveModal(item)"
                  >Move</a
                >
                <a
                  v-if="canDelete"
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click.prevent="deleteModal(item)"
                  >Delete</a
                >
              </ul>
            </div>
          </div>
        </template>
      </EasyDataTable>
    </div>

    <ViewValidation
      ref="viewModalRef"
      :service="viewService"
      :sparepart-requests="sparepartRequests"
      @close="closeViewModal"
    />

    <EditValidationCustomers
      ref="editModalRef"
      :service="editService"
      :service-device="servicesDevice"
      :usages="usages"
      :technicians="technicians"
      @update="updateServices"
      @close="closeEditModal"
    />

    <MoveValidationCustomers
      ref="moveModalRef"
      :service="moveService"
      @update="moveServices"
      @close="closeMoveModal"
    />

    <DeleteServices ref="deleteModalRef" @delete="deleteServices" @close="closeDeleteModal" />
  </div>
</template>

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
