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
        @update:options="serverOptions = $event"
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
        <template #items="{ item }">
          <tr>
            <td>{{ item.date_in_services }}</td>
            <td>{{ item.serial_number }}</td>
            <td>{{ item.customers }}</td>
            <td>{{ getDeviceName(item.services_devices_id) }}</td>
          </tr>
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a href="#" class="head-text text-decoration-none" @click="viewModal(item)">View</a>
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
                  @click="editModal(item)"
                  >Edit</a
                >
                <a
                  href="#"
                  class="dropdown-item head-text text-decoration-none"
                  @click="moveModal(item)"
                  >Move</a
                >
                <a
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

  <EditPendingCustomers
    ref="editModalRef"
    :service="editService"
    @update="updateServices"
    @close="closeEditModal"
  />

  <MovePendingCustomers
    ref="moveModalRef"
    :service="moveService"
    @update="updateServices"
    @close="closeMoveModal"
  />

  <DeletePendingCustomers ref="deleteModalRef" @delete="deleteServices" @close="closeDeleteModal" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import MovePendingCustomers from '../Services/Modal/Customers/MovePendingCustomers.vue'
import EditPendingCustomers from '../Services/Modal/Customers/EditPendingCustomers.vue'
import DeletePendingCustomers from '../Services/Modal/Customers/DeletePendingCustomers.vue'
import Search from '../Layouts/SearchAll.vue'
import { mockServerItems, refreshData } from '../../mock/mockPendingCustomers'

const servicesDevice = ref([])
const moveModalRef = ref(null)
const editModalRef = ref(null)
const deleteModalRef = ref(null)
const moveService = ref({})
const editService = ref({})
const loading = ref(true)
const services = ref([])
const id = ref(null)

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Date in early', value: 'date_in_services' },
  { text: 'Serial number', value: 'serial_number' },
  { text: 'Customers', value: 'customers' },
  { text: 'Device type', value: 'services_devices_id' },
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

watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true },
)

onMounted(() => {
  loadFromServer()
  fetchServicesDevice()
})

const getDeviceName = (id) => {
  const device = servicesDevice.value.find((d) => d.id === id)
  return device ? device.name : 'Unknown'
}

const fetchServicesDevice = async () => {
  try {
    const response = await axios.get('services-device')
    servicesDevice.value = response.data.data
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
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
    showToast(error.data.message, 'error')
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
    showToast(error.data.message, 'error')
    closeDeleteModal()
  }
}

function moveModal(service) {
  moveService.value = { ...service }
  id.value = service.id
  moveModalRef.value.showModal()
}

function editModal(service) {
  editService.value = { ...service }
  id.value = service.id
  editModalRef.value.showModal()
}

function deleteModal(service) {
  id.value = service.id
  deleteModalRef.value.showModal()
}

function closeMoveModal() {
  moveModalRef.value.hideModal()
}

function closeEditModal() {
  editModalRef.value.hideModal()
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
