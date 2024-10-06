<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-customers-button">
        <AddCustomers @customer-added="refreshCustomers" />
      </div>
      <div class="others-customers d-flex align-items-center gap-2">
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
        <template #items="{ item }">
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.address }}</td>
          </tr>
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
        <form @submit.prevent="updateCustomers" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Name</label>
              <input
                v-model="editCustomers.name"
                type="text"
                class="form-control shadow-none"
                id="name"
              />
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label fw-bold">Phone</label>
              <input
                v-model="editCustomers.phone"
                type="number"
                class="form-control shadow-none"
                id="phone"
              />
            </div>
            <div class="mb-3">
              <label for="address" class="form-label fw-bold">Address</label>
              <textarea
                v-model="editCustomers.address"
                type="text"
                class="form-control shadow-none"
                id="address"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-primary">Submit</button>
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
          <button type="button" class="btn btn-danger text-white" @click="deleteCustomers">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddCustomers from '../Customers/Modal/AddCustomers'
import Search from '../../Layouts/SearchAll'
import ExportCustomers from '../Customers/Excel/ExportCustomers.vue'
import ImportCustomers from '../Customers/Excel/ImportCustomers.vue'
import { mockServerItems, refreshData } from '../../../mock/mockCustomers'

let editForm
let deleteForm
const editCustomers = ref({})
const loading = ref(true)
const customers = ref([])
const id = ref(null)

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

const refreshCustomers = () => {
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
  serverOptions.value.page = 1 // Reset to first page when searching
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
})

const updateCustomers = async () => {
  try {
    const response = await axios.put(`customers/${id.value}`, editCustomers.value)
    showToast(response.data.message, 'success')
    closeModal()
    refreshCustomers()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.data.message, 'error')
    closeModal()
  }
}

const deleteCustomers = async () => {
  try {
    const response = await axios.delete(`customers/${id.value}`)
    showToast(response.data.message, 'success')
    closeModal()
    refreshCustomers()
  } catch (error) {
    console.error('Data failed to delete', error)
    showToast(error.data.message, 'error')
    closeModal()
  }
}

function editModal(customer) {
  editCustomers.value = { ...customer }
  id.value = customer.id
  editForm.show()
}

function deleteModal(customer) {
  id.value = customer.id
  deleteForm.show()
}

function closeModal() {
  editForm.hide()
  deleteForm.hide()
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
