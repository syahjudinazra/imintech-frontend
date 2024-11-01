<template>
  <div class="container-fluid">
    <div class="tittle-firmwares">
      <h2>K1</h2>
    </div>
    <div class="d-flex">
      <div class="sidebar-list">
        <SidebarItem />
      </div>
      <div class="firmwares-content w-100">
        <Search class="mb-2" :onSearch="updateSearch" />
        <EasyDataTable
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          @update:options="serverOptions = $event"
          :headers="headers"
          :items="firmwares"
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
              <td>{{ getDeviceName(item.firmwares_devices_id) }}</td>
              <td>{{ item.version }}</td>
              <td>{{ getAndroidName(item.androids_id) }}</td>
            </tr>
          </template>
          <template #item-flash="item">
            <button
              v-if="item.flash"
              @click="downloadFile(item.flash)"
              class="btn btn-success btn-sm text-white"
            >
              Download
            </button>
          </template>
          <template #item-ota="item">
            <button
              v-if="item.ota"
              @click="downloadFile(item.ota)"
              class="btn btn-secondary btn-sm text-white"
            >
              Download
            </button>
          </template>
        </EasyDataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import SidebarItem from '../../components/Firmwares/SidebarItem.vue'
import Search from '../../components/Layouts/SearchAll'
import { mockServerItems } from '../../mock/listFirmwares/k1'

const loading = ref(true)
const firmwares = ref([])
const firmwaresDevice = ref([])
const androids = ref([])

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Devices', value: 'firmwares_devices_id' },
  { text: 'Version', value: 'version' },
  { text: 'Android', value: 'androids_id' },
  { text: 'Flash Link', value: 'flash' },
  { text: 'OTA Link', value: 'ota' },
])

const serverItemsLength = ref(10)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'name',
  sortType: 'desc',
  searchTerm: '',
})

const loadFromServer = async () => {
  loading.value = true
  try {
    const { serverCurrentPageItems, serverTotalItemsLength } = await mockServerItems(
      serverOptions.value,
      token,
    )
    firmwares.value = serverCurrentPageItems
    serverItemsLength.value = serverTotalItemsLength
  } catch (error) {
    console.error('Error loading data', error)
    showToast('Failed to load M2-202 firmware data.', 'error')
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
  loadFromServer()
  fetchFirmwaresDevice()
  fetchAndroid()
})

const getDeviceName = (id) => {
  const device = firmwaresDevice.value.find((d) => d.id === id)
  return device ? device.name : 'Unknown'
}

const getAndroidName = (id) => {
  const android = androids.value.find((a) => a.id === id)
  return android ? android.name : 'Unknown'
}

const downloadFile = (url) => {
  window.open(url, '_blank')
}

const fetchFirmwaresDevice = async () => {
  try {
    const response = await axios.get('firmwares-device')
    firmwaresDevice.value = response.data.firmwaresdevice
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchAndroid = async () => {
  try {
    const response = await axios.get('android')
    androids.value = response.data.android
  } catch (error) {
    console.error('Data not found', error)
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

@media (min-width: 1200px) {
  .firmwares-content {
    margin-left: 2rem;
  }
}
</style>
