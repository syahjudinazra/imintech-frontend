<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddLoan @data-added="refreshList()" />
      </div>
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
        :items="loans"
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
        <template #item-date_loan="{ date_loan }">
          {{ formatDate(date_loan) }}
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

    <ViewLoan ref="viewModalRef" :loan="viewLoan" @close="closeViewModal" />

    <EditLoan
      ref="editModalRef"
      :loan="editLoan"
      :loan-device="loanDevice"
      :rams="rams"
      :androids="androids"
      :customers="customers"
      :sales="sales"
      @update="updateServices"
      @close="closeEditModal"
    />

    <MoveLoan
      ref="moveModalRef"
      :loan="moveLoan"
      :loan-device="loanDevice"
      :rams="rams"
      :androids="androids"
      :customers="customers"
      :sales="sales"
      @update="moveLoans"
      @close="closeMoveModal"
    />

    <DeleteLoan ref="deleteModalRef" @delete="deleteServices" @close="closeDeleteModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddLoan from '../Loan/Modal/AddLoan.vue'
import ViewLoan from '../Loan/Modal/ViewLoan.vue'
import MoveLoan from '../Loan/Modal/MoveLoan.vue'
import EditLoan from '../Loan/Modal/EditLoan.vue'
import DeleteLoan from '../Loan/Modal/DeleteLoan.vue'
import Search from '../Layouts/SearchAll.vue'
import { mockServerItems, refreshData } from '../../mock/mockLoans'

// Refs
const id = ref(null)
const loans = ref([])
const loanDevice = ref([])
const sales = ref([])
const rams = ref([])
const androids = ref([])
const customers = ref([])
const viewModalRef = ref(null)
const editModalRef = ref(null)
const moveModalRef = ref(null)
const deleteModalRef = ref(null)
const viewLoan = ref({})
const moveLoan = ref({})
const editLoan = ref({})
const loading = ref(true)

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = [
  { text: 'Date', value: 'date_loan', sortable: true },
  { text: 'Serial Number', value: 'serial_number', sortable: true },
  { text: 'Device Type', value: 'loan_devices_id', sortable: true },
  { text: 'Customers', value: 'customers_id', sortable: true },
  { text: 'Action', value: 'action', sortable: false },
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
    loans.value = serverCurrentPageItems
    serverItemsLength.value = serverTotalItemsLength
  } catch (error) {
    console.error('Error loading data', error)
    showToast('Failed to load loans data.', 'error')
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

const fetchLoanDevice = async () => {
  try {
    const response = await axios.get('loans-device')
    loanDevice.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchAndroid = async () => {
  try {
    const response = await axios.get('android')
    androids.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch androids.', 'error')
  }
}

const fetchRam = async () => {
  try {
    const response = await axios.get('ram')
    rams.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch ram.', 'error')
  }
}

const fetchCustomers = async () => {
  try {
    const response = await axios.get('customers')
    customers.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch customers.', 'error')
  }
}

const fetchSales = async () => {
  try {
    const response = await axios.get('sales')
    sales.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch sales', 'error')
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

const moveLoans = async (formData) => {
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
  viewLoan.value = { ...service }
  id.value = service.id
  viewModalRef.value.showModal()
}

const moveModal = (service) => {
  moveLoan.value = { ...service }
  id.value = service.id
  moveModalRef.value.showModal()
}

const editModal = (service) => {
  editLoan.value = { ...service }
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
  fetchLoanDevice()
  fetchAndroid()
  fetchRam()
  fetchCustomers()
  fetchSales()
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
