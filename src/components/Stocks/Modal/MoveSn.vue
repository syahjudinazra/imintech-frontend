<template>
  <div class="d-flex">
    <!-- Main Content -->
    <div class="flex-grow-1">
      <button type="button" class="btn btn-secondary btn-sm" @click="openModal">
        <CIcon :icon="cilTruck" style="color: white" />
        <span>{{ loading ? 'Moving...' : 'Move SN' }}</span>
      </button>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="modal fade show"
        style="display: block"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Moving SN</h1>
              <button
                type="button"
                class="btn-close"
                @click="closeModal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="d-flex justify-content-between">
                <div class="w-30">
                  <textarea
                    v-model="stocks.serialNumbers"
                    class="moveSn-area form-control shadow-none"
                    rows="9"
                    placeholder="Enter SN (Multiple SN can separated by enter)"
                  ></textarea>
                </div>

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
                  <template #items="{ item }">
                    <tr>
                      <td>{{ item.serial_number }}</td>
                      <td>{{ item.customers_id }}</td>
                      <td>{{ item.stocks_devices_id }}</td>
                      <td>{{ item.status }}</td>
                    </tr>
                  </template>
                </EasyDataTable>
              </div>
              <button
                @click="searchSerialNumbers"
                class="btn btn-outline-danger btn-sm mt-2"
                style="bottom: 10px; right: 10px"
                :disabled="!serialNumbers.trim()"
              >
                Add SN
              </button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeModal">
                Cancel
              </button>
              <button type="button" class="btn btn-danger btn-sm text-white">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-open': showSidebar }" v-if="showSidebar">
      <div class="sidebar-header">
        <h5>Search Results</h5>
        <button @click="closeSidebar" class="btn-close"></button>
      </div>
      <div class="sidebar-content">
        <div v-if="searchResults.length > 0">
          <div v-for="(result, index) in searchResults" :key="index" class="search-result-item">
            <div class="serial-number">{{ result.serialNumber }}</div>
            <div :class="['status', result.found ? 'text-success' : 'text-danger']">
              {{ result.found ? 'Found in database' : 'Not found' }}
            </div>
          </div>
        </div>
        <div v-else class="no-results">No results to display</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CIcon } from '@coreui/icons-vue'
import { cilTruck } from '@coreui/icons'
import { mockServerItems } from '../../../mock/mockStocks'

const stocks = ref({})
const loading = ref(false)
const showModal = ref(false)
const serialNumbers = ref('')
const showSidebar = ref(false)
const searchResults = ref([])
const serverOptions = ref({})
const serverItemsLength = ref(0)

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Serial Number', value: 'serial_number' },
  { text: 'Customers', value: 'customers_id' },
  { text: 'Devices', value: 'stocks_devices_id' },
  { text: 'Status', value: 'status' },
  { text: 'Action', value: 'action' },
])

// Modal controls
const openModal = () => {
  showModal.value = true
  document.body.classList.add('modal-open')
}

const closeModal = () => {
  showModal.value = false
  document.body.classList.remove('modal-open')
}

// Mock database function - replace with actual API call
const checkSerialNumberInDB = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return Math.random() > 0.5
}

const searchSerialNumbers = async () => {
  const snArray = serialNumbers.value.split('\n').filter((sn) => sn.trim())

  loading.value = true
  searchResults.value = []

  try {
    for (const sn of snArray) {
      const found = await checkSerialNumberInDB(sn.trim())
      searchResults.value.push({
        serialNumber: sn.trim(),
        found,
      })
    }
    showSidebar.value = true
  } catch (error) {
    console.error('Error searching serial numbers:', error)
  } finally {
    loading.value = false
  }
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
  } finally {
    loading.value = false
  }
}

const closeSidebar = () => {
  showSidebar.value = false
  searchResults.value = []
}

onMounted(() => {
  loadFromServer()
})
</script>

<style scoped>
.moveSn-area {
  width: 100%;
  resize: none;
}

input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}

.btn:hover {
  color: #fff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 300px;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  transform: translateX(100%);
  z-index: 1050;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-content {
  padding: 1rem;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.search-result-item {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.serial-number {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.status {
  font-size: 0.875rem;
}

.text-success {
  color: #198754;
}

.text-danger {
  color: #dc3545;
}

.no-results {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.w-30 {
  width: 30%;
}
</style>
