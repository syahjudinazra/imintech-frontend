<script setup>
import { ref, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddStocksDevice from '../StocksDevice/Modal/AddStocksDevice'
import Search from '../../Layouts/SearchAll'
import StatusPage from '../../../components/StatusPage/404Page.vue'
import { mockServerItems } from '../../../mock/mockStocksDevice'

let editForm
let deleteForm
const editStocksDevice = ref({})
const loading = ref(false)
const stocksdevice = ref([])
const id = ref(null)
const userRole = ref('')

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'Name', value: 'name', sortable: true },
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
    stocksdevice.value = serverCurrentPageItems
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
  editForm = new Modal(document.getElementById('editForm'))
  deleteForm = new Modal(document.getElementById('deleteForm'))
  loadFromServer()
  fetchUserRole()
})

const updateStocksDevice = async () => {
  try {
    loading.value = true
    const response = await axios.put(`stocks-device/${id.value}`, editStocksDevice.value)
    showToast(response.data.message, 'success')
    closeModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.data.message, 'error')
    closeModal()
  }
}

const deleteStocksDevice = async () => {
  try {
    const response = await axios.delete(`stocks-device/${id.value}`)
    showToast(response.data.message, 'success')
    closeModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    showToast(error.data.message, 'error')
    closeModal()
  }
}

function editModal(stocksdevice) {
  editStocksDevice.value = { ...stocksdevice }
  id.value = stocksdevice.id
  editForm.show()
}

function deleteModal(stocksdevice) {
  id.value = stocksdevice.id
  deleteForm.show()
}

function closeModal() {
  editForm.hide()
  deleteForm.hide()
}
</script>

<template>
  <div class="container-fluid" v-if="userRole === 'superadmin'">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddStocksDevice @data-added="refreshList()" />
      </div>
      <div class="others-stocks-device d-flex align-items-center gap-2">
        <Search :onSearch="updateSearch" />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update:options="serverOptions = $event"
        :headers="headers"
        :items="stocksdevice"
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

  <!--Edit Modal-->
  <div
    class="modal fade"
    id="editForm"
    tabindex="-1"
    aria-labelledby="editForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editForm_label">Edit Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="updateStocksDevice" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Name</label>
              <input
                v-model="editStocksDevice.name"
                type="text"
                class="form-control shadow-none"
                id="name"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-danger text-white" :disabled="loading">
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!--Delete Modal-->
  <div class="modal fade show" id="deleteForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want delete this data?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-danger text-white" @click="deleteStocksDevice">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
