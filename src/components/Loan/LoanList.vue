<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddLoan from './Modal/AddLoan.vue'
import ViewLoan from './Modal/ViewLoan.vue'
import MoveLoan from './Modal/MoveLoan.vue'
import EditLoan from './Modal/EditLoan.vue'
import DeleteLoan from './Modal/DeleteLoan.vue'
import ExportLoans from './Excel/ExportLoan.vue'
import ImportLoans from './Excel/ImportLoan.vue'
import Search from '../Layouts/SearchAll.vue'
import { mockServerItems } from '../../mock/mockLoans'

// Refs
const id = ref(null)
const loans = ref([])
const loanDevice = ref([])
const sales = ref([])
const rams = ref([])
const androids = ref([])
const viewModalRef = ref(null)
const editModalRef = ref(null)
const moveModalRef = ref(null)
const deleteModalRef = ref(null)
const viewLoan = ref({})
const moveLoan = ref({})
const editLoan = ref({})
const loading = ref(false)

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = [
  { text: 'Date', value: 'date_loan', sortable: true },
  { text: 'Days', value: 'calculated_days', sortable: true },
  { text: 'Serial Number', value: 'serial_number', sortable: true },
  { text: 'Device Type', value: 'loan_devices_id', sortable: true },
  { text: 'Customers', value: 'customers', sortable: true },
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
const canView = computed(() => checkPermission('View Loan'))
const canEdit = computed(() => checkPermission('Edit Loan'))
const canMove = computed(() => checkPermission('Move Loan'))

// Add the calculateDays function
const calculateDays = (date) => {
  if (!date) return { days: '-', isOverdue: false }

  try {
    const start = new Date(date)
    const today = new Date()

    // Reset time portion for accurate day calculation
    start.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const differenceInTime = today.getTime() - start.getTime()
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24))

    return {
      days: differenceInDays,
      isOverdue: differenceInDays > 14,
    }
  } catch (error) {
    console.error('Error calculating days:', error)
    return { days: '-', isOverdue: false }
  }
}

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

const fetchLoanDevice = async () => {
  try {
    loanDevice.value = await fetchAllData('loans-device')
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
    showToast('Failed to fetch androids.', 'error')
  }
}

const fetchRam = async () => {
  try {
    rams.value = await fetchAllData('ram')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch ram.', 'error')
  }
}

const fetchSales = async () => {
  try {
    sales.value = await fetchAllData('sales')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch sales', 'error')
  }
}

const updateLoans = async (updatedLoans) => {
  try {
    loading.value = true
    const response = await axios.put(`loans/${id.value}`, updatedLoans)
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
    loading.value = true
    const response = await axios.post(`loans-move/${id.value}`, formData, {
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

const deleteLoans = async () => {
  try {
    const response = await axios.delete(`loans/${id.value}`)
    showToast(response.data.message, 'success')
    closeDeleteModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    showToast(error.response?.data?.message || 'Delete failed', 'error')
    closeDeleteModal()
  }
}

const viewModal = async (loan) => {
  viewLoan.value = { ...loan }
  id.value = loan.id
  viewModalRef.value.showModal()
}

const moveModal = (loan) => {
  moveLoan.value = { ...loan }
  id.value = loan.id
  moveModalRef.value.showModal()
}

const editModal = (loan) => {
  editLoan.value = { ...loan }
  id.value = loan.id
  editModalRef.value.showModal()
}

const deleteModal = (loan) => {
  id.value = loan.id
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
  fetchSales()
})
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddLoan @data-added="refreshList()" />
      </div>
      <div class="others d-flex align-items-center gap-2">
        <ExportLoans />
        <ImportLoans />
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
        <!-- Date column -->
        <template #item-date_loan="{ date_loan }">
          <span :class="{ 'text-danger fw-bold': calculateDays(date_loan).isOverdue }">
            {{ formatDate(date_loan) }}
          </span>
        </template>
        <!-- Calculated Days column -->
        <template #item-calculated_days="{ date_loan }">
          <span :class="{ 'text-danger fw-bold': calculateDays(date_loan).isOverdue }">
            {{ calculateDays(date_loan).days }}
          </span>
        </template>
        <!-- Serial Number column -->
        <template #item-serial_number="{ serial_number, date_loan }">
          <span :class="{ 'text-danger fw-bold': calculateDays(date_loan).isOverdue }">
            {{ serial_number }}
          </span>
        </template>

        <!-- Device Type column -->
        <template #item-loan_devices_id="{ loan_devices_id, date_loan }">
          <span :class="{ 'text-danger fw-bold': calculateDays(date_loan).isOverdue }">
            {{ loan_devices_id }}
          </span>
        </template>

        <!-- Customers column -->
        <template #item-customers="{ customers, date_loan }">
          <span :class="{ 'text-danger fw-bold': calculateDays(date_loan).isOverdue }">
            {{ customers }}
          </span>
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
            <div v-if="canEdit" class="btn-group dropend">
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
                  v-if="canMove"
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
      :sales="sales"
      :loading="loading"
      @update="updateLoans"
      @close="closeEditModal"
    />

    <MoveLoan
      ref="moveModalRef"
      :loan="moveLoan"
      :loading="loading"
      @update="moveLoans"
      @close="closeMoveModal"
    />

    <DeleteLoan ref="deleteModalRef" @delete="deleteLoans" @close="closeDeleteModal" />
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
