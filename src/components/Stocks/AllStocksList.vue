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
        <template #items="{ item }">
          <tr>
            <td>{{ item.serial_number }}</td>
            <td>{{ getDeviceName(item.stocks_devices_id) }}</td>
            <td>{{ item.no_invoice }}</td>
            <td>{{ item.date_in }}</td>
            <td>{{ item.date_out }}</td>
            <td>{{ getCustomerName(item.customers_id) }}</td>
            <td>{{ item.status }}</td>
          </tr>
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

  <EditStocks
    v-if="userCan('edit Stocks')"
    ref="editModalRef"
    :stock="editStocks"
    :stocks-device="stocksDevice"
    :customers="customers"
    @update="updateStocks"
    @close="closeEditModal"
  />

  <DeleteFirmwares
    v-if="userCan('delete Firmwares')"
    ref="deleteModalRef"
    @delete="deleteFirmwares"
    @close="closeDeleteModal"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import EditStocks from '../../components/Stocks/Modal/EditStocks.vue'
import DeleteFirmwares from '../../components/Firmwares/Modal/DeleteFirmwares.vue'
import Search from '../../components/Layouts/SearchAll'
import { mockServerItems, refreshData } from '../../mock/mockStocks'

const id = ref(null)
const stocks = ref([])
const stocksDevice = ref([])
const skuDevice = ref([])
const customers = ref([])
const editModalRef = ref(null)
const deleteModalRef = ref(null)
const editStocks = ref({})
const loading = ref(true)
const userPermissions = ref([])
const userRole = ref('')

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Serial Number', value: 'serial_number' },
  { text: 'Devices', value: 'stocks_devices_id' },
  { text: 'No Invoice', value: 'no_invoice' },
  { text: 'Date of Entry', value: 'date_in' },
  { text: 'Date Exit', value: 'date_out' },
  { text: 'Customers', value: 'customers_id' },
  { text: 'Status', value: 'status' },
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

const getDeviceName = (id) => {
  const device = stocksDevice.value.find((d) => d.id === id)
  return device ? device.name : 'Unknown'
}

const getCustomerName = (id) => {
  const customer = customers.value.find((a) => a.id === id)
  return customer ? customer.name : 'Unknown'
}

const fetchStocksDevice = async () => {
  try {
    const response = await axios.get('stocks-device')
    stocksDevice.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchSkuDevice = async () => {
  try {
    const response = await axios.get('stocks-sku-device')
    skuDevice.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchCustomers = async () => {
  try {
    const response = await axios.get('customers')
    customers.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
  }
}

const updateStocks = async (updatedStock) => {
  try {
    const stockToUpdate = {
      ...updatedStock,
      firmwares_devices_id: parseInt(updatedStock.firmwares_devices_id),
      customers_id: parseInt(updatedStock.customers_id),
      android: updatedStock.android || updatedStock.customers_id,
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
  editStocks.value = {
    ...firmware,
    firmwares_devices_id: firmware.firmwares_devices_id,
    customers_id: firmware.customers_id,
  }
  id.value = firmware.id

  console.log('editStocks.value set to:', editStocks.value)
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
