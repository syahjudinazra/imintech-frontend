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

    <!-- Header Controls with Improved Layout -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2">
        <AddStock @data-added="refreshList" />
        <button class="btn btn-outline-secondary" @click="refreshList" :disabled="loading">
          <i class="bi bi-arrow-clockwise" :class="{ rotate: loading }"></i>
          Refresh
        </button>
      </div>
      <div class="d-flex align-items-center gap-2">
        <ExportStocks :data="groupedStocks" :loading="loading" />
        <ImportStocks @import-complete="refreshList" />
        <MoveSn
          :customer="customers"
          :stocks-devices="stocksDevice"
          :location="locations"
          @move-complete="refreshList"
        />
        <Search @search="updateSearch" :disabled="loading" placeholder="Search devices..." />
      </div>
    </div>

    <!-- Enhanced Data Table -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <EasyDataTable
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :headers="headers"
          :items="processedUniqueStocks"
          :loading="loading"
          :theme-color="BASE_COLOR"
          :rows-per-page="10"
          :rows-items="[10, 25, 50, 100]"
          table-class-name="head-table"
          alternating
          border-cell
          buttons-pagination
          @update:options="handleOptionsUpdate"
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
const customers = ref([])
const locations = ref([])
const loading = ref(true)
const summary = ref({})
const error = ref(null)

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

const serverItemsLength = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'device',
  sortType: 'desc',
  searchTerm: '',
})

// Device mapping helper
const getDeviceName = computed(() => {
  const deviceMap = new Map(devices.value.map((device) => [device.id, device.name]))
  return (deviceId) => deviceMap.get(deviceId) || deviceId
})

// New computed property to group stocks by device ID
const groupedStocks = computed(() => {
  const grouped = new Map()

  stocks.value.forEach((stock) => {
    if (!grouped.has(stock.stocks_devices_id)) {
      grouped.set(stock.stocks_devices_id, {
        stocks_devices_id: stock.stocks_devices_id,
        device: getDeviceName.value(stock.stocks_devices_id),
        warehouse: 0,
        services: 0,
        loan: 0,
        sold: 0,
        damage: 0,
        entrust: 0,
        total: 0,
      })
    }
  })

  // Update counts from summary data
  Object.entries(summary.value).forEach(([status, counts]) => {
    Object.entries(counts).forEach(([deviceId, count]) => {
      const device = grouped.get(parseInt(deviceId))
      if (device) {
        device[status.toLowerCase()] = count
        device.total += count
      }
    })
  })

  return Array.from(grouped.values())
})

// Use the grouped data for the table
const processedUniqueStocks = computed(() => {
  return groupedStocks.value
})

// Rest of the computed properties
const getStatusClass = computed(() => {
  return (status) => STATUS_CLASSES[status]
})

const getTotalByStatus = computed(() => {
  return (status) => {
    if (!summary.value[status]) return 0
    return Object.values(summary.value[status]).reduce((sum, count) => sum + count, 0)
  }
})

const getPercentageByStatus = computed(() => {
  return (status) => {
    const statusTotal = getTotalByStatus.value(status)
    const overallTotal = STATUS_VALUES.reduce((sum, s) => sum + getTotalByStatus.value(s), 0)
    return overallTotal ? Math.round((statusTotal / overallTotal) * 100) : 0
  }
})

const loadFromServer = async () => {
  loading.value = true
  error.value = null

  try {
    const { page, rowsPerPage, sortBy, sortType, searchTerm } = serverOptions.value
    const response = await axios.get('stocks', {
      params: {
        page,
        per_page: rowsPerPage,
        sort_by: sortBy === 'device' ? 'stocks_devices_id' : sortBy,
        sort_type: sortType,
        search: searchTerm,
      },
    })

    const { data, devices: deviceData, summary: summaryData, total } = response.data

    stocks.value = data
    devices.value = deviceData
    summary.value = summaryData
    serverItemsLength.value = total
  } catch (error) {
    console.error('Error loading data:', error)
    error.value = 'Failed to load stocks data'
    showToast('Failed to load stocks data. Please try again.', 'error')
  } finally {
    loading.value = false
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

const fetchLocations = async () => {
  try {
    const response = await axios.get('location')
    locations.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
  }
}

const handleOptionsUpdate = (newOptions) => {
  serverOptions.value = newOptions
}

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

// Watchers
watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true },
)

// Lifecycle hooks
onMounted(() => {
  loadFromServer()
  fetchCustomers()
  fetchLocations()
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

.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
}

.rotate {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
      bottom/100% 50% content-box content-box;
  background-repeat: no-repeat;
  animation: l11 1s infinite linear;
}

@keyframes l11 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
