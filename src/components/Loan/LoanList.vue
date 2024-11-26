<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <div class="add-button">
        <AddLoan @customer-added="refreshTable" />
      </div>
      <div class="d-flex align-items-center gap-2">
        <ExportLoan />
        <ImportLoan />
        <Search :onSearch="handleSearch" />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="totalRecords"
        :headers="headers"
        :items="formattedLoans"
        :loading="loading"
        :theme-color="baseColor"
        :rows-per-page="10"
        table-class-name="head-table"
        alternating
        show-index
        border-cell
        buttons-pagination
        @update:options="handleTableUpdate"
      >
        <template #loading>
          <div class="loader"></div>
        </template>
        <template #empty-message>
          <p>No loan data found</p>
        </template>
        <template #item-action="item">
          <div class="d-flex gap-2">
            <a href="#" class="head-text text-decoration-none" @click.prevent="showEditModal(item)"
              >Edit</a
            >
            <a
              href="#"
              class="head-text text-decoration-none"
              @click.prevent="showDeleteModal(item)"
              >Delete</a
            >
          </div>
        </template>
      </EasyDataTable>
    </div>

    <EditLoan
      ref="editModalRef"
      :loan-data="selectedLoan"
      @close="selectedLoan = {}"
      @refresh="refreshTable"
    />
    <DeleteLoan
      ref="deleteModalRef"
      :loan-id="selectedLoan.id"
      @close="selectedLoan = {}"
      @refresh="refreshTable"
    />
  </div>
</template>
Last edited 1 minute ago

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import AddLoan from './Modal/AddLoan.vue'
import Search from '../Layouts/SearchAll.vue'
import ExportLoan from './Excel/ExportLoan.vue'
import ImportLoan from './Excel/ImportLoan.vue'
import EditLoan from './Modal/EditLoan.vue'
import DeleteLoan from './Modal/DeleteLoan.vue'

// Constants and refs
const baseColor = '#e55353'
const loading = ref(true)
const loans = ref([])
const totalRecords = ref(0)
const selectedLoan = ref({})
const editModalRef = ref(null)
const deleteModalRef = ref(null)

const headers = [
  { text: 'Date', value: 'date_loan' },
  { text: 'Serial Number', value: 'serial_number' },
  { text: 'Device Type', value: 'loan_devices_id' },
  { text: 'Customer', value: 'customers_id' },
  { text: 'Action', value: 'action' },
]

const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'date_loan',
  sortType: 'desc',
  search: '',
})

// Computed property to format loans data
const formattedLoans = computed(() => {
  return loans.value.map((loan) => ({
    id: loan.id,
    date_loan: loan.date_loan || '-',
    serial_number: loan.serial_number || '-',
    loan_devices_id: loan.loan_devices_id || '-',
    customers_id: loan.customers_id || '-',
    rams_id: loan.rams_id || '-',
    androids_id: loan.androids_id || '-',
    sales_id: loan.sales_id || '-',
  }))
})

// Setup axios
const token = localStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Methods
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      draw: 1,
      start: (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage,
      length: serverOptions.value.rowsPerPage,
      search: { value: serverOptions.value.search },
      order: [
        {
          column: headers.findIndex((h) => h.value === serverOptions.value.sortBy),
          dir: serverOptions.value.sortType,
        },
      ],
    }

    const response = await axios.get('loans', { params })

    if (response.data.data) {
      loans.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length
    } else {
      loans.value = []
      totalRecords.value = 0
    }
  } catch (error) {
    console.error('Error loading loans:', error)
    showToast(error.response?.data?.message || 'Failed to load loan data', 'error')
    loans.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

const handleTableUpdate = (options) => {
  serverOptions.value = { ...options }
  loadData()
}

const handleSearch = (term) => {
  serverOptions.value.search = term
  serverOptions.value.page = 1
  loadData()
}

const refreshTable = () => {
  loadData()
}

// Modal handlers
const showEditModal = (loan) => {
  selectedLoan.value = { ...loan }
  editModalRef.value?.showModal()
}

const showDeleteModal = (loan) => {
  selectedLoan.value = { ...loan }
  deleteModalRef.value?.showModal()
}

onMounted(() => {
  loadData()
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
