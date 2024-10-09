<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddSpareparts @data-added="refreshList()" />
      </div>
      <div class="others d-flex align-items-center gap-2">
        <ExportSpareparts />
        <ImportSpareparts />
        <Search :onSearch="updateSearch" />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update:options="serverOptions = $event"
        :headers="headers"
        :items="spareparts"
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
            <td>{{ item.no_spareparts }}</td>
            <td>{{ getDeviceName(item.spareparts_devices_id) }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price }}</td>
          </tr>
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a href="#" class="head-text text-decoration-none" @click="addQty(item)">Qty+</a>
            <a href="#" class="head-text text-decoration-none" @click="reduceQty(item)">Qty-</a>
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

  <QuantityManagement
    ref="quantityModalRef"
    :sparepart="selectedSparepart"
    :action="quantityAction"
    @update="updateQuantity"
    @close="closeQuantityModal"
  />

  <EditSpareparts
    ref="editModalRef"
    :sparepart="editSpareparts"
    :spareparts-device="sparepartsDevice"
    @update="updateSpareparts"
    @close="closeEditModal"
  />

  <DeleteSpareparts ref="deleteModalRef" @delete="deleteSpareparts" @close="closeDeleteModal" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddSpareparts from '../Spareparts/Modal/AddSpareparts.vue'
import EditSpareparts from '../Spareparts/Modal/EditSpareparts.vue'
import DeleteSpareparts from '../Spareparts/Modal/DeleteSpareparts.vue'
import QuantityManagement from '../Spareparts/Modal/QuantityManagement.vue'
import Search from '../Layouts/SearchAll'
import ExportSpareparts from '../Spareparts/Excel/ExportSpareparts.vue'
import ImportSpareparts from '../Spareparts/Excel/ImportSpareparts.vue'
import { mockServerItems, refreshData } from '@/mock/mockSpareparts'

const id = ref(null)
const spareparts = ref([])
const sparepartsDevice = ref([])
const editModalRef = ref(null)
const deleteModalRef = ref(null)
const editSpareparts = ref({})
const loading = ref(true)
const quantityModalRef = ref(null)
const selectedSparepart = ref({})
const quantityAction = ref('')

const token = localStorage.getItem('token')
// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'No Spareparts', value: 'no_spareparts' },
  { text: 'Devices', value: 'spareparts_devices_id' },
  { text: 'Name', value: 'name' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Price', value: 'price' },
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
    spareparts.value = serverCurrentPageItems
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

const addQty = (item) => {
  selectedSparepart.value = item
  quantityAction.value = 'add'
  quantityModalRef.value.showModal()
}

const reduceQty = (item) => {
  selectedSparepart.value = item
  quantityAction.value = 'reduce'
  quantityModalRef.value.showModal()
}

const updateQuantity = (newQuantity) => {
  const index = spareparts.value.findIndex((s) => s.id === selectedSparepart.value.id)
  if (index !== -1) {
    spareparts.value[index].quantity = newQuantity
  }
}

const closeQuantityModal = () => {
  if (quantityModalRef.value) {
    quantityModalRef.value.hideModal()
  }
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

const updateSpareparts = async (updatedSpareparts) => {
  try {
    // Ensure we're sending IDs, not names
    const sparepartToUpdate = {
      ...updatedSpareparts,
      spareparts_devices_id: parseInt(updatedSpareparts.spareparts_devices_id),
    }

    // Only send changed fields
    const changedFields = Object.keys(updatedSpareparts).reduce((acc, key) => {
      if (updatedSpareparts[key] !== undefined) {
        acc[key] = sparepartToUpdate[key]
      }
      return acc
    }, {})

    const response = await axios.put(`spareparts/${id.value}`, changedFields)
    showToast(response.data.message, 'success')
    closeEditModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to change', error)
    showToast(error.response?.data?.message || 'Failed to update spareparts', 'error')
  }
}

const deleteSpareparts = async (sparepartId) => {
  try {
    const response = await axios.delete(`spareparts/${sparepartId}`)
    showToast(response.data.message || 'Spareparts deleted successfully', 'success')
    closeDeleteModal()
    refreshList()
  } catch (error) {
    console.error('Data failed to delete', error)
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while deleting the spareparts'
    showToast(errorMessage, 'error')
  } finally {
    closeDeleteModal()
  }
}

function editModal(sparepart) {
  console.log('Spareparts object received:', sparepart)

  if (!sparepart) {
    console.error('Spareparts object is null or undefined')
    showToast('Unable to edit sparepart: Invalid data', 'error')
    return
  }

  // Ensure we're working with IDs, not names
  editSpareparts.value = {
    ...sparepart,
    spareparts_devices_id: sparepart.spareparts_devices_id,
    androids_id: sparepart.androids_id,
  }
  id.value = sparepart.id

  console.log('editSpareparts.value set to:', editSpareparts.value)
  console.log('id.value set to:', id.value)

  editModalRef.value.showModal()
}

function deleteModal(sparepart) {
  deleteModalRef.value.showModal(sparepart)
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
