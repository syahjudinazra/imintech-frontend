<template>
  <div class="container-fluid" v-if="userRole === 'superadmin'">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddCustomers @customer-added="refreshList" />
      </div>
      <div class="others d-flex align-items-center gap-2">
        <ExportCustomers />
        <ImportCustomers />
        <Search :onSearch="updateSearch" />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update:options="serverOptions = $event"
        :headers="headers"
        :items="customers"
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
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a href="#" class="head-text text-decoration-none" @click="editModal(item)">Edit</a>
            <a href="#" class="head-text text-decoration-none" @click="deleteModal(item)">Delete</a>
          </div>
        </template>
      </EasyDataTable>
    </div>
  </div>
  <p v-else-if="userRole === ''">Loading...</p>
  <StatusPage v-else />

  <EditCustomers
    ref="editModalRef"
    :customers="editCustomers"
    @update="updateCustomers"
    @close="closeEditModal"
  />

  <DeleteCustomers ref="deleteModalRef" @delete="deleteCustomers" @close="closeDeleteModal" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddCustomers from './Modal/AddCustomers.vue'
import EditCustomers from './Modal/EditCustomers.vue'
import DeleteCustomers from './Modal/DeleteCustomers.vue'
import Search from '../../Layouts/SearchAll'
import ExportCustomers from '../Customers/Excel/ExportCustomers.vue'
import ImportCustomers from '../Customers/Excel/ImportCustomers.vue'
import StatusPage from '../../../components/StatusPage/404Page.vue'
import { mockServerItems } from '../../../mock/mockCustomers'

const editModalRef = ref(null)
const deleteModalRef = ref(null)
const editCustomers = ref({})
const loading = ref(true)
const customers = ref([])
const id = ref(null)
const userRole = ref('')

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Customers', value: 'name' },
  { text: 'Phone Number', value: 'phone' },
  { text: 'Address', value: 'address' },
  { text: 'Action', value: 'action' },
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
  loadFromServer()
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

const loadFromServer = async () => {
  loading.value = true
  try {
    const { serverCurrentPageItems, serverTotalItemsLength } = await mockServerItems(
      serverOptions.value,
      token,
    )
    customers.value = serverCurrentPageItems
    serverItemsLength.value = serverTotalItemsLength
  } catch (error) {
    console.error('Error loading data', error)
    showToast('Failed to load customers data.', 'error')
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
  fetchUserRole()
})

const updateCustomers = async (updatedCustomersDevice) => {
  try {
    const response = await axios.put(`customers/${id.value}`, updatedCustomersDevice)
    showToast(response.data.message, 'success')
    closeEditModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.data.message, 'error')
    closeEditModal()
  }
}

const deleteCustomers = async () => {
  try {
    const response = await axios.delete(`customers/${id.value}`)
    showToast(response.data.message, 'success')
    closeDeleteModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    showToast(error.data.message, 'error')
    closeDeleteModal()
  }
}

function editModal(customer) {
  editCustomers.value = { ...customer }
  id.value = customer.id
  editModalRef.value.showModal()
}

function deleteModal(customer) {
  id.value = customer.id
  deleteModalRef.value.showModal(customer)
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
