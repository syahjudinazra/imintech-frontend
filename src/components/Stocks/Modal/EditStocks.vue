<template>
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
        <form @submit.prevent="editForm">
          <div class="modal-body">
            <!--Serial Number-->
            <div class="mb-3">
              <label for="serial_number" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="editedStock.serial_number"
                type="text"
                class="form-control shadow-none"
                id="serial_number"
              />
            </div>

            <!--Device Type-->
            <div class="mb-3">
              <label for="stocksDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="editedStock.stocks_devices_id"
                :options="stocksDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="stocksDevice"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--SKU Device Type-->
            <div class="mb-3">
              <label for="stocksSkuDevice" class="form-label fw-bold">SKU Device Type</label>
              <v-select
                v-model="editedStock.stocks_sku_devices_id"
                :options="stocksSkuDevice"
                :reduce="(sku) => sku.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select SKU Device Type"
                id="stocksSkuDevice"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--No Invoice-->
            <div class="mb-3">
              <label for="no_invoice" class="form-label fw-bold">No Invoice</label>
              <input
                v-model="editedStock.no_invoice"
                type="text"
                class="form-control shadow-none"
                id="no_invoice"
              />
            </div>

            <!--Date in-->
            <div class="mb-3">
              <label class="fw-bold" for="date_in">Date of Entry</label>
              <VueDatePicker
                v-model="editedStock.date_in"
                :enable-time-picker="false"
                :format="customDateFormat"
                :model-value="formatDateForPicker(editedStock.date_in)"
                id="date_in"
                placeholder="Select Date"
              />
            </div>

            <!--Date out-->
            <div class="mb-3">
              <label class="fw-bold" for="date_out">Date Exit</label>
              <VueDatePicker
                v-model="editedStock.date_out"
                :enable-time-picker="false"
                :format="customDateFormat"
                :model-value="formatDateForPicker(editedStock.date_out)"
                id="date_out"
                placeholder="Select Date"
              />
            </div>

            <!--Customers-->
            <div class="mb-3">
              <label for="customers" class="form-label fw-bold">Customers</label>
              <input
                v-model="editedStock.customers"
                type="text"
                class="form-control shadow-none"
                id="customers"
              />
            </div>

            <!--Location-->
            <div class="mb-3">
              <label for="location" class="form-label fw-bold">Location</label>
              <v-select
                v-model="editedStock.locations_id"
                :options="locations"
                :reduce="(location) => location.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Location"
                id="location"
              >
                <template #no-options="{ search, searching }">
                  <template v-if="searching">
                    No results found for <em>{{ search }}</em>
                  </template>
                  <em v-else>Start typing to search...</em>
                </template>
              </v-select>
            </div>

            <!--Shipping Code-->
            <div class="mb-3">
              <label for="shipping_code" class="form-label fw-bold">Shipping Code</label>
              <input
                v-model="editedStock.shipping_code"
                type="text"
                class="form-control shadow-none"
                id="shipping_code"
              />
            </div>

            <!--Information-->
            <div class="mb-3">
              <label for="information" class="form-label fw-bold">Information</label>
              <textarea
                v-model="editedStock.information"
                type="text"
                class="form-control shadow-none"
                id="information"
              />
            </div>

            <!--Status Section-->
            <div class="form-group mb-3">
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="form-check">
                <input
                  :value="'Warehouse'"
                  v-model="editedStock.status"
                  class="form-check-input"
                  type="radio"
                  id="statusWarehouse"
                />
                <label class="form-check-label" for="statusWarehouse">Warehouse</label>
              </div>
              <div class="form-check">
                <input
                  :value="'Services'"
                  v-model="editedStock.status"
                  class="form-check-input"
                  type="radio"
                  id="statusServices"
                />
                <label class="form-check-label" for="statusServices">Services</label>
              </div>
              <div class="form-check">
                <input
                  :value="'Loan'"
                  v-model="editedStock.status"
                  class="form-check-input"
                  type="radio"
                  id="statusLoan"
                />
                <label class="form-check-label" for="statusLoan">Loan</label>
              </div>
              <div class="form-check">
                <input
                  :value="'Sold'"
                  v-model="editedStock.status"
                  class="form-check-input"
                  type="radio"
                  id="statusSold"
                />
                <label class="form-check-label" for="statusSold">Sold</label>
              </div>
              <div class="form-check">
                <input
                  :value="'Damage'"
                  v-model="editedStock.status"
                  class="form-check-input"
                  type="radio"
                  id="statusDamage"
                />
                <label class="form-check-label" for="statusDamage">Damage</label>
              </div>
              <div class="form-check">
                <input
                  :value="'Entrust'"
                  v-model="editedStock.status"
                  class="form-check-input"
                  type="radio"
                  id="statusEntrust"
                />
                <label class="form-check-label" for="statusEntrust">Entrust</label>
              </div>
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
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, reactive } from 'vue'
import { Modal } from 'bootstrap'
import vSelect from 'vue-select'
import { showToast } from '@/utilities/toast'
import 'vue-select/dist/vue-select.css'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  stock: {
    type: Object,
    default: () => ({}),
  },
  stocksDevice: {
    type: Array,
    default: () => [],
  },
  stocksSkuDevice: {
    type: Array,
    default: () => [],
  },
  locations: {
    type: Array,
    default: () => [],
  },
  loading: {
    default: () => [],
  },
})

const emit = defineEmits(['update', 'close'])
const isDataChanged = ref(false)
const initialStock = ref(null)
const editedStock = reactive({})
const changedFields = reactive({})

// Format date to MySQL datetime format
const formatDateForMySQL = (date) => {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

// Date formatting
const customDateFormat = 'dd/MM/yyyy'

const formatDateForPicker = (date) => {
  if (!date) return null
  return new Date(date)
}

const formatDate = (date) => {
  if (!date) return '-'

  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return '-'

    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

watch(
  () => props.stock,
  (newStock) => {
    if (newStock) {
      initialStock.value = cloneDeep(newStock)
      Object.assign(editedStock, cloneDeep(newStock))
    }
  },
  { immediate: true, deep: true },
)

watch(
  editedStock,
  (newValue) => {
    if (initialStock.value) {
      Object.keys(newValue).forEach((key) => {
        if (JSON.stringify(newValue[key]) !== JSON.stringify(initialStock.value[key])) {
          changedFields[key] = true
        } else {
          delete changedFields[key]
        }
      })
      isDataChanged.value = Object.keys(changedFields).length > 0
    }
  },
  { deep: true },
)

let editModal

const editForm = () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  const updatedStock = { id: editedStock.id }
  Object.keys(changedFields).forEach((key) => {
    if (key === 'date_in' || key === 'date_out') {
      updatedStock[key] = formatDateForMySQL(editedStock[key])
    } else {
      updatedStock[key] = editedStock[key]
    }
  })

  emit('update', updatedStock)
  hideModal()
}

const closeModal = () => {
  hideModal()
  emit('close')
}

const showModal = () => {
  editModal.show()
}

const hideModal = () => {
  editModal.hide()
}

defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  formatDate()
  editModal = new Modal(document.getElementById('editForm'))
})
</script>

<style scoped>
input:focus,
textarea:focus {
  border-color: #d22c36;
}

input[type='radio']:checked {
  border-color: #d22c36;
  background-color: #d22c36;
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
  border-radius: 0.25rem;
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

.v-select.vs--open .vs__dropdown-toggle {
  border-bottom-color: transparent;
}
</style>
