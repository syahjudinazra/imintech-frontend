<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger text-white" @click="openModal">Add Data</button>

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
          <h5 class="modal-title" id="addForm_label">Add Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="addSpareparts">
          <div class="modal-body">
            <div class="mb-3">
              <label for="no_spareparts" class="form-label fw-bold">No Spareparts</label>
              <input
                v-model="spareparts.no_spareparts"
                type="text"
                class="form-control shadow-none"
                id="no_spareparts"
                placeholder="Input No Spareparts"
              />
            </div>
            <div class="mb-3">
              <label for="tipe" class="form-label fw-bold">Device type</label>
              <v-select
                v-model="spareparts.spareparts_devices_id"
                :options="sparepartsDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="tipe"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Name</label>
              <input
                v-model="spareparts.name"
                type="text"
                class="form-control shadow-none"
                id="name"
                placeholder="Input name"
              />
            </div>
            <div class="mb-3">
              <label for="quantity" class="form-label fw-bold">Quantity</label>
              <input
                v-model="spareparts.quantity"
                type="number"
                class="form-control shadow-none"
                id="quantity"
                placeholder="Input Quantity"
              />
            </div>
            <div class="mb-3">
              <label for="price" class="form-label fw-bold">Price</label>
              <input
                v-model="formattedPrice"
                type="text"
                class="form-control shadow-none"
                id="price"
                placeholder="Input Price"
              />
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
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const spareparts = ref({
  no_spareparts: '',
  spareparts_devices_id: '',
  name: '',
  quantity: '',
  price: '',
})

const sparepartsDevice = ref([])
let addForm

const formattedPrice = computed({
  get() {
    return spareparts.value.price ? Number(spareparts.value.price).toLocaleString() : ''
  },
  set(value) {
    spareparts.value.price = value.replace(/[^\d]/g, '')
  },
})

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

const fetchSparepartsDevice = async () => {
  try {
    sparepartsDevice.value = await fetchAllData('spareparts-device')
  } catch (error) {
    console.error('Data not found', error)
  }
}

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
  fetchSparepartsDevice()
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

const addSpareparts = async () => {
  try {
    // Prepare form data
    const formData = new FormData()
    formData.append('no_spareparts', spareparts.value.no_spareparts)
    formData.append('spareparts_devices_id', spareparts.value.spareparts_devices_id)
    formData.append('name', spareparts.value.name)
    formData.append('quantity', spareparts.value.quantity)
    formData.append('price', spareparts.value.price)

    const response = await axios.post('spareparts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Data added successfully:', response.data.message)
    showToast(response.data.message, 'success')
    closeModal()
  } catch (error) {
    console.error('Error add data:', error)
    showToast(error.data.message, 'error')
  }
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
