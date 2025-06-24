<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddStock from '../../components/Stocks/Modal/AddStocks.vue'
import MoveSn from '../../components/Stocks/Modal/MoveSn.vue'
import Search from '../Layouts/SearchAll'
import ExportStocks from '../Stocks/Excel/ExportStocks.vue'
import ImportStocks from '../Stocks/Excel/ImportStocks.vue'

// State management
const stocks = ref([])
const devices = ref([])
const locations = ref([])
const loading = ref(true)
const summary = ref({})
const statusTotals = ref({}) // Added for direct status totals
const error = ref(null)
const pagination = ref({
  total: 0,
  current_page: 1,
  per_page: 10,
  last_page: 1,
})

// Constants
const STATUS_VALUES = ['Warehouse', 'Services', 'Loan', 'Sold', 'Damage', 'Entrust']
const BASE_COLOR = '#e55353'

const STATUS_CLASSES = {
  Warehouse: 'primary',
  Services: 'warning',
  Loan: 'info',
  Sold: 'success',
  Damage: 'danger',
  Entrust: 'secondary',
}

const headers = [
  { text: 'Device', value: 'device', sortable: true },
  { text: 'Warehouse', value: 'warehouse', sortable: true },
  { text: 'Services', value: 'services', sortable: true },
  { text: 'Loan', value: 'loan', sortable: true },
  { text: 'Sold', value: 'sold', sortable: true },
  { text: 'Damage', value: 'damage', sortable: true },
  { text: 'Entrust', value: 'entrust', sortable: true },
  { text: 'Total', value: 'total', sortable: true },
]

const serverOptions = ref({
  page: 1,
  sortBy: 'stocks_devices_id',
  sortType: 'desc',
  searchTerm: '',
})

// Permission checks
const checkPermission = (permissionName) => {
  try {
    const userData = JSON.parse(localStorage.getItem('users'))
    if (!userData?.permissions) return false
    return userData.permissions.some(
      (permission) => permission.name.toLowerCase() === permissionName.toLowerCase(),
    )
  } catch (error) {
    console.error('Error checking permissions:', error)
    return false
  }
}

// Computed permissions
const canCreate = computed(() => checkPermission('Create Stocks'))
const canExport = computed(() => checkPermission('Export Stocks'))
const canImport = computed(() => checkPermission('Import Stocks'))
const canMove = computed(() => checkPermission('Move SN Stocks'))

// Transform data for table display
const processedStocks = computed(() => {
  if (!devices.value || devices.value.length === 0) {
    return []
  }

  const groupedData = new Map()

  // Initialize counters for each device
  devices.value.forEach((device) => {
    const deviceId = parseInt(device.id)
    groupedData.set(deviceId, {
      stocks_devices_id: deviceId,
      device: device.name,
      warehouse: 0,
      services: 0,
      loan: 0,
      sold: 0,
      damage: 0,
      entrust: 0,
      total: 0,
    })
  })

  // Update counts from summary data
  if (summary.value && Object.keys(summary.value).length > 0) {
    Object.entries(summary.value).forEach(([status, deviceCounts]) => {
      if (deviceCounts && typeof deviceCounts === 'object') {
        Object.entries(deviceCounts).forEach(([deviceId, count]) => {
          const deviceIdInt = parseInt(deviceId)
          const deviceData = groupedData.get(deviceIdInt)
          if (deviceData) {
            const statusKey = status.toLowerCase()
            const countValue = parseInt(count) || 0
            deviceData[statusKey] = countValue
            deviceData.total += countValue
          }
        })
      }
    })
  }

  const result = Array.from(groupedData.values())
  return result
})

// Fixed: Status helpers using direct totals from backend
const getStatusClass = computed(() => (status) => STATUS_CLASSES[status])

const getTotalByStatus = computed(() => (status) => {
  // Use the direct totals from backend instead of calculating
  return statusTotals.value[status] || 0
})

const getPercentageByStatus = computed(() => (status) => {
  const statusTotal = getTotalByStatus.value(status)
  const overallTotal = STATUS_VALUES.reduce((sum, s) => sum + getTotalByStatus.value(s), 0)
  return overallTotal ? Math.round((statusTotal / overallTotal) * 100) : 0
})

// Server communication
const loadFromServer = async () => {
  loading.value = true
  error.value = null

  try {
    const { page, sortBy, sortType, searchTerm } = serverOptions.value
    const response = await axios.get('stocks', {
      params: {
        page,
        sort_by: sortBy,
        sort_type: sortType,
        search: searchTerm,
      },
    })

    const {
      data,
      devices: deviceData,
      summary: summaryData,
      status_totals: statusTotalsData, // Get the direct totals
      pagination: paginationData,
    } = response.data

    stocks.value = data
    devices.value = deviceData
    summary.value = summaryData
    statusTotals.value = statusTotalsData || {} // Store direct totals
    pagination.value = paginationData
  } catch (error) {
    console.error('Error loading data:', error)
    error.value = 'Failed to load stocks data'
    showToast('Failed to load stocks data. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

const fetchLocations = async () => {
  try {
    const response = await axios.get('location')
    locations.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
  }
}

// Event handlers
const refreshList = () => {
  serverOptions.value.page = 1
  loadFromServer()
}

const updateSearch = (term) => {
  serverOptions.value = {
    ...serverOptions.value,
    searchTerm: term,
    page: 1,
  }
}

const handleSort = (options) => {
  serverOptions.value = {
    ...serverOptions.value,
    sortBy: options.sortBy,
    sortType: options.sortType,
  }
}

// Lifecycle
onMounted(() => {
  loadFromServer()
  fetchLocations()
})

// Watchers
watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true },
)
</script>

<template>
  <div class="container-fluid">
    <!-- Summary Statistics -->
    <div class="row mb-4">
      <div v-for="status in STATUS_VALUES" :key="status" class="col-md-2">
        <div
          class="card h-100 border-0 shadow-sm"
          :class="`border-start border-4 border-${getStatusClass(status)}`"
        >
          <div class="card-body">
            <h6 class="card-title text-muted mb-2">{{ status }}</h6>
            <h3 class="mb-2">{{ getTotalByStatus(status) }}</h3>
            <div class="mt-2 pt-2 border-top">
              <small class="text-muted"> {{ getPercentageByStatus(status) }}% of total </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header Controls -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2">
        <AddStock v-if="canCreate" @data-added="refreshList" />
        <button class="btn btn-outline-secondary" @click="refreshList" :disabled="loading">
          <i class="bi bi-arrow-clockwise" :class="{ rotate: loading }"></i>
          Refresh
        </button>
      </div>
      <div class="d-flex align-items-center gap-2">
        <ExportStocks v-if="canExport" :data="processedStocks" :loading="loading" />
        <ImportStocks v-if="canImport" @import-complete="refreshList" />
        <MoveSn
          v-if="canMove"
          :stocks-devices="devices"
          :location="locations"
          @move-complete="refreshList"
        />
        <Search @search="updateSearch" :disabled="loading" placeholder="Search devices..." />
      </div>
    </div>

    <!-- Data Table -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <EasyDataTable
          :headers="headers"
          :items="processedStocks"
          :loading="loading"
          :theme-color="BASE_COLOR"
          :server-options="serverOptions"
          :server-items-length="pagination.total"
          table-class-name="customize-table"
          alternating
          border-cell
          hide-footer
          @server-page-change="(page) => (serverOptions.page = page)"
          @server-sort-change="handleSort"
        >
          <template #loading>
            <div class="d-flex justify-content-center p-4">
              <div class="loader"></div>
            </div>
          </template>

          <template #empty-message>
            <div class="text-center p-4">
              <p class="mt-2">No data found</p>
            </div>
          </template>

          <!-- Numeric columns with right alignment -->
          <template #item-warehouse="{ warehouse }">
            <div class="text-end">{{ warehouse || 0 }}</div>
          </template>
          <template #item-services="{ services }">
            <div class="text-end">{{ services || 0 }}</div>
          </template>
          <template #item-loan="{ loan }">
            <div class="text-end">{{ loan || 0 }}</div>
          </template>
          <template #item-sold="{ sold }">
            <div class="text-end">{{ sold || 0 }}</div>
          </template>
          <template #item-damage="{ damage }">
            <div class="text-end">{{ damage || 0 }}</div>
          </template>
          <template #item-entrust="{ entrust }">
            <div class="text-end">{{ entrust || 0 }}</div>
          </template>
          <template #item-total="{ total }">
            <div class="text-end fw-bold">{{ total || 0 }}</div>
          </template>
        </EasyDataTable>
      </div>
    </div>
  </div>
</template>
