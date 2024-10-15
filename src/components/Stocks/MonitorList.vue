<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddStock @data-added="refreshList()" />
      </div>
      <div class="others d-flex align-items-center gap-2">
        <ExportStocks />
        <ImportStocks />
        <MoveSn />
        <Search :onSearch="updateSearch" />
      </div>
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
            <td>{{ getDeviceName(item.spareparts_devices_id) }}</td>
            <td>{{ item.no_spareparts }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price }}</td>
          </tr>
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddStock from '../../components/Stocks/Modal/AddStocks.vue'
import MoveSn from '../../components/Stocks/Modal/MoveSn.vue'
import Search from '../Layouts/SearchAll'
import ExportStocks from '../Stocks/Excel/ExportStocks.vue'
import ImportStocks from '../Stocks/Excel/ImportStocks.vue'
import { mockServerItems, refreshData } from '@/mock/mockSpareparts'

const stocks = ref([])
const sparepartsDevice = ref([])
const loading = ref(true)

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Devices', value: 'spareparts_devices_id' },
  { text: 'Warehouse', value: 'no_spareparts' },
  { text: 'Services', value: 'name' },
  { text: 'On Loan', value: 'quantity' },
  { text: 'Damaged', value: 'price' },
  { text: 'Entrust', value: 'price' },
  { text: 'Total', value: 'price' },
])

const serverItemsLength = ref(0)
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
    stocks.value = serverCurrentPageItems
    serverItemsLength.value = serverTotalItemsLength
  } catch (error) {
    console.error('Error loading data', error)
    showToast('Failed to load spareparts data.', 'error')
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
  fetchSparepartsDevice()
  loadFromServer()
})

const getDeviceName = (id) => {
  const device = sparepartsDevice.value.find((d) => d.id === id)
  return device ? device.name : 'Unknown'
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
