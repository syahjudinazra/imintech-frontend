<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-end">
      <Search :onSearch="updateSearch" />
    </div>
    <div class="mt-2">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update:options="serverOptions = $event"
        :headers="headers"
        :items="stocks"
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
        <template #item-status="{ status }">
          <span :class="getStatusBadgeClass(status)" class="px-2 py-1 rounded-pill">
            {{ status }}
          </span>
        </template>
        <template #item-date_in="{ date_in }">
          {{ formatDate(date_in) }}
        </template>
        <template #item-date_out="{ date_out }">
          {{ formatDate(date_out) }}
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a
              v-if="userCan('view Stocks')"
              href="#"
              class="head-text text-decoration-none"
              @click="viewModal(item)"
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
                  v-if="userCan('edit Stocks')"
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click="editModal(item)"
                  >Edit</a
                >
                <a
                  v-if="userCan('delete Stocks')"
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click="deleteModal(item)"
                  >Delete</a
                >
              </ul>
            </div>
          </div>
        </template>
      </EasyDataTable>
    </div>
  </div>

  <ViewStocks
    v-if="userCan('view Stocks')"
    ref="viewModalRef"
    :stocks-device="stocksDevice"
    :stocks-sku-device="skuDevice"
    :customers="customers"
    :locations="locations"
    @close="handleClose"
  />

  <EditStocks
    v-if="userCan('edit Stocks')"
    ref="editModalRef"
    :stock="editStocks"
    :stocks-device="stocksDevice"
    :stocks-sku-device="skuDevice"
    :customers="customers"
    :locations="locations"
    @update="updateStocks"
    @close="closeEditModal"
  />

  <DeleteStocks
    v-if="userCan('delete Stocks')"
    ref="deleteModalRef"
    @delete="deleteStocks"
    @close="closeDeleteModal"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import EditStocks from '../../components/Stocks/Modal/EditStocks.vue'
import ViewStocks from '../../components/Stocks/Modal/ViewStocks.vue'
import DeleteStocks from '../../components/Stocks/Modal/DeleteStocks.vue'
import Search from '../../components/Layouts/SearchAll'
import { mockServerItems } from '../../mock/Stocks/mockSold'

const id = ref(null)
const stocks = ref([])
const stocksDevice = ref([])
const skuDevice = ref([])
const customers = ref([])
const locations = ref([])
const editModalRef = ref(null)
const viewModalRef = ref(null)
const deleteModalRef = ref(null)
const editStocks = ref({})
const loading = ref(true)
const userPermissions = ref([])
const userRole = ref('')

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Serial Number', value: 'serial_number' },
  { text: 'Devices', value: 'stocks_devices' },
  { text: 'No Invoice', value: 'no_invoice' },
  { text: 'Date of Entry', value: 'date_in' },
  { text: 'Date Exit', value: 'date_out' },
  { text: 'Customers', value: 'customers_id' },
  { text: 'Status', value: 'status' },
  { text: 'Action', value: 'action' },
])
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
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
    stocks.value = serverCurrentPageItems
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

const userCan = (permission) => {
  return userPermissions.value.includes(permission)
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

// Enhanced status badge styling with more visual distinction
const getStatusBadgeClass = (status) => {
  const baseClasses = 'badge fw-normal text-white'
  const statusClasses = {
    Warehouse: `${baseClasses} bg-primary fw-semibold`,
    Services: `${baseClasses} bg-warning fw-semibold`,
    Loan: `${baseClasses} bg-info fw-semibold`,
    Sold: `${baseClasses} bg-success fw-semibold`,
    Damage: `${baseClasses} bg-danger fw-semibold`,
    Entrust: `${baseClasses} bg-secondary fw-semibold`,
  }
  return statusClasses[status] || `${baseClasses} bg-light text-dark`
}

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

watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true },
)

onMounted(() => {
  loadFromServer()
  fetchStocksDevice()
  fetchSkuDevice()
  fetchCustomers()
  fetchLocations()
  fetchUserPermissions()
  fetchUserRole()
})

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

const fetchStocksDevice = async () => {
  try {
    stocksDevice.value = await fetchAllData('stocks-device')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchSkuDevice = async () => {
  try {
    skuDevice.value = await fetchAllData('stocks-sku-device')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchCustomers = async () => {
  try {
    customers.value = await fetchAllData('customers')
  } catch (error) {
    console.error('Data not found', error)
  }
}

const fetchLocations = async () => {
  try {
    locations.value = await fetchAllData('location')
  } catch (error) {
    console.error('Data not found', error)
  }
}

const updateStocks = async (updatedStock) => {
  try {
    const stockToUpdate = {
      ...updatedStock,
      stocks_devices_id: parseInt(updatedStock.stocks_devices_id),
      stocks_sku_devices_id: parseInt(updatedStock.stocks_sku_devices_id),
      customers_id: parseInt(updatedStock.customers_id),
      locations_id: parseInt(updatedStock.locations_id),
      locations: updatedStock.locations || updatedStock.customers_id,
    }

    const changedFields = Object.keys(updatedStock).reduce((acc, key) => {
      if (updatedStock[key] !== undefined) {
        acc[key] = stockToUpdate[key]
      }
      return acc
    }, {})

    const response = await axios.put(`stocks/${id.value}`, changedFields)
    showToast(response.data.message, 'success')
    closeEditModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.response?.data?.message || 'Failed to update firmware', 'error')
  }
}

const deleteStocks = async (stockId) => {
  try {
    const response = await axios.delete(`stocks/${stockId}`)
    showToast(response.data.message || 'Stocks deleted successfully', 'success')
    closeDeleteModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred while deleting the stock'
    showToast(errorMessage, 'error')
  } finally {
    closeDeleteModal()
  }
}

function viewModal(stock) {
  viewModalRef.value.showModal(stock)
}

function editModal(stock) {
  console.log('Stocks object received:', stock)

  if (!stock) {
    console.error('Stocks object is null or undefined')
    showToast('Unable to edit stocks: Invalid data', 'error')
    return
  }

  // Ensure we're working with IDs, not names
  editStocks.value = {
    ...stock,
    stocks_devices_id: stock.stocks_devices_id,
    customers_id: stock.customers_id,
  }
  id.value = stock.id

  console.log('editStocks.value set to:', editStocks.value)
  console.log('id.value set to:', id.value)

  editModalRef.value.showModal()
}

function deleteModal(stock) {
  deleteModalRef.value.showModal(stock)
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

.badge {
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 4px;
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
