<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger btn-sm text-white" @click="openModal">
    Add data
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addForm"
    tabindex="-1"
    aria-labelledby="addForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addForm_label">Add data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="addLoans">
          <div class="modal-body">
            <!--Date of entry section-->
            <div class="mb-3">
              <label class="form-label fw-bold" for="date_loan">Date of Entry</label>
              <VueDatePicker
                v-model="loans.date_loan"
                :enable-time-picker="false"
                placeholder="Select Date"
              />
            </div>

            <!--Serial Number Section-->
            <div class="mb-3">
              <label for="serial_number" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="loans.serial_number"
                type="text"
                class="form-control shadow-none"
                id="serial_number"
                placeholder="Input Serial Number"
              />
            </div>

            <!--Device type section-->
            <div class="mb-3">
              <label for="loan_devices_id" class="form-label fw-bold">Device type</label>
              <v-select
                v-model="loans.loan_devices_id"
                :options="loanDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="loan_devices_id"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--RAM section-->
            <div class="mb-3">
              <label for="rams_id" class="form-label fw-bold">RAM</label>
              <v-select
                v-model="loans.rams_id"
                :options="rams"
                :reduce="(ram) => ram.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select RAM"
                id="rams_id"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--Android section-->
            <div class="mb-3">
              <label for="androids_id" class="form-label fw-bold">Android</label>
              <v-select
                v-model="loans.androids_id"
                :options="androids"
                :reduce="(android) => android.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Android"
                id="androids_id"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--Customers section-->
            <div class="mb-3">
              <label for="customers_id" class="form-label fw-bold">Customers</label>
              <v-select
                v-model="loans.customers_id"
                :options="customers"
                :reduce="(customer) => customer.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Customers"
                id="customers_id"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--Sales section-->
            <div class="mb-3">
              <label for="sales_id" class="form-label fw-bold">Sales</label>
              <v-select
                v-model="loans.sales_id"
                :options="sales"
                :reduce="(sales) => sales.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Sales"
                id="sales_id"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!-- Phone number section-->
            <div class="mb-3">
              <label for="phone_number" class="form-label fw-bold">Phone Number</label>
              <input
                v-model="loans.phone_number"
                type="text"
                class="form-control shadow-none"
                id="phone_number"
                placeholder="Input Phone Number"
              />
            </div>

            <!-- Sender section-->
            <div class="mb-3">
              <label for="sender" class="form-label fw-bold">Sender</label>
              <input
                v-model="loans.sender"
                type="text"
                class="form-control shadow-none"
                id="sender"
                placeholder="Input Sender"
              />
            </div>

            <!--Shipping equipment section-->
            <div class="mb-3">
              <label class="form-label fw-bold" for="shipping_equipment">Shipping Equipment</label>
              <textarea
                v-model="loans.shipping_equipment"
                class="form-control shadow-none"
                id="shipping_equipment"
                placeholder="Example: Adaptor, Box, Ducking etc..."
                required
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-danger text-white">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const loans = ref({})

const loanDevice = ref([])
const androids = ref([])
const rams = ref([])
const customers = ref([])
const sales = ref([])

let addForm
const emit = defineEmits(['customer-added'])

// Generic function to fetch all data
const fetchAllData = async (endpoint, currentPage = 1, allData = []) => {
  try {
    const response = await axios.get(`${endpoint}`, {
      params: {
        page: currentPage,
        rowsPerPage: 300,
        sortBy: 'id',
        sortType: 'asc',
      },
    })

    const { data, total } = response.data
    const combinedData = [...allData, ...data]

    // Calculate if need more pages
    const totalPages = Math.ceil(total / 100)

    if (currentPage < totalPages) {
      return await fetchAllData(endpoint, currentPage + 1, combinedData)
    }

    return combinedData
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

const fetchLoanDevice = async () => {
  try {
    loanDevice.value = await fetchAllData('loans-device')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch device types.', 'error')
  }
}

const fetchAndroid = async () => {
  try {
    androids.value = await fetchAllData('android')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch androids.', 'error')
  }
}

const fetchRam = async () => {
  try {
    rams.value = await fetchAllData('ram')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch ram.', 'error')
  }
}

const fetchCustomers = async () => {
  try {
    customers.value = await fetchAllData('customers')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch customers.', 'error')
  }
}

const fetchSales = async () => {
  try {
    sales.value = await fetchAllData('sales')
  } catch (error) {
    console.error('Data not found', error)
    showToast('Failed to fetch sales', 'error')
  }
}

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
  fetchLoanDevice()
  fetchAndroid()
  fetchRam()
  fetchCustomers()
  fetchSales()
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

const addLoans = async () => {
  try {
    // Prepare form data
    const formData = new FormData()
    const mysqlDate = formatDateForMySQL(loans.value.date_loan)
    formData.append('date_loan', mysqlDate)
    formData.append('serial_number', loans.value.serial_number)
    formData.append('loan_devices_id', loans.value.loan_devices_id)
    formData.append('rams_id', loans.value.rams_id)
    formData.append('androids_id', loans.value.androids_id)
    formData.append('customers_id', loans.value.customers_id)
    formData.append('address', loans.value.address)
    formData.append('sales_id', loans.value.sales_id)
    formData.append('phone_number', loans.value.phone_number)
    formData.append('sender', loans.value.sender)
    formData.append('shipping_equipment', loans.value.shipping_equipment)

    const response = await axios.post('loans', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      showToast(response.data.message, 'success')
      closeModal()
      // Clear the form
      loans.value = {}
      // Emit event to refresh parent
      emit('customer-added')
    } else {
      showToast(response.data.message || 'Failed to add loan', 'error')
    }
  } catch (error) {
    console.error('Error adding data:', error)
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred while adding the loan'
    showToast(errorMessage, 'error')
  }
}
// Format date for MySQL
const formatDateForMySQL = (date) => {
  if (!date) return null
  const d = new Date(date)
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0') +
    ' ' +
    String(d.getHours()).padStart(2, '0') +
    ':' +
    String(d.getMinutes()).padStart(2, '0') +
    ':' +
    String(d.getSeconds()).padStart(2, '0')
  )
}
</script>

<style scoped>
input:focus,
textarea:focus,
select:focus,
.v-select.vs--open .vs__dropdown-toggle {
  border-color: #d22c36;
}

.v-select {
  --vs-controls-color: #6c757d;
  --vs-border-color: #ced4da;

  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.v-select .vs__dropdown-toggle {
  padding: 0;
  border: none;
}

.v-select .vs__selected-options {
  padding: 0;
}

.v-select .vs__search::placeholder {
  color: #6c757d;
}

.v-select .vs__clear {
  display: none;
}
</style>
