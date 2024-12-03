<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
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
        <template #item-date_in_services="{ date_in_services }">
          {{ formatDate(date_in_services) }}
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a href="#" class="head-text text-decoration-none" @click.prevent="viewModal(item)"
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
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click.prevent="editModal(item)"
                  >Edit</a
                >
                <a
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click.prevent="moveModal(item)"
                  >Move</a
                >
                <a
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

    <ViewDoneCustomers
      ref="viewModalRef"
      :service="viewService"
      :sparepart-requests="sparepartRequests"
      @close="closeViewModal"
    />

    <EditDoneCustomers
      ref="editModalRef"
      :service="editService"
      :service-device="servicesDevice"
      :usages="usages"
      :technicians="technicians"
      @update="updateServices"
      @close="closeEditModal"
    />

    <MoveDoneCustomers
      ref="moveModalRef"
      :service="moveService"
      @update="moveServices"
      @close="closeMoveModal"
    />

    <DeleteServices ref="deleteModalRef" @delete="deleteServices" @close="closeDeleteModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import ViewDoneCustomers from '../Services/Modal/Customers/ViewDoneCustomers.vue'
import MoveDoneCustomers from '../Services/Modal/Customers/MoveDoneCustomers.vue'
import EditDoneCustomers from '../Services/Modal/Customers/EditDoneCustomers.vue'
import DeleteServices from '../Services/Modal/DeleteServices.vue'
import Search from '../Layouts/SearchAll.vue'
import { mockServerItems, refreshData } from '../../mock/mockDoneCustomers'

// Refs
const id = ref(null)
const services = ref([])
const servicesDevice = ref([])
const sparepartsDevice = ref([])
const sparepartRequests = ref([])
const usages = ref([])
const technicians = ref([])
const spareparts = ref([])
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
  { text: 'Date in early', value: 'date_in_services' },
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

const fetchServicesDevice = async () => {
  try {
    const response = await axios.get('services-device')
    servicesDevice.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchUsages = async () => {
  try {
    const response = await axios.get('usages')
    usages.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch usages.', 'error')
  }
}

const fetchTechnicians = async () => {
  try {
    const response = await axios.get('technician')
    technicians.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch technician.', 'error')
  }
}

const fetchSpareparts = async () => {
  try {
    const response = await axios.get('spareparts')
    spareparts.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch spareparts.', 'error')
  }
}

const fetchSparepartsDevice = async () => {
  try {
    const response = await axios.get('spareparts-device')
    sparepartsDevice.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
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
    const response = await axios.delete(`services/${id.value}`)
    showToast(response.data.message, 'success')
    closeDeleteModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    showToast(error.response?.data?.message || 'Delete failed', 'error')
    closeDeleteModal()
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
  deleteModalRef.value.hideModal()
}

onMounted(() => {
  loadFromServer()
  fetchServicesDevice()
  fetchUsages()
  fetchTechnicians()
  fetchSpareparts()
  fetchSparepartsDevice()
})
</script>

<style scoped>
.head-table {
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
