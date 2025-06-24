<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import { cilTrash, cilPlus } from '@coreui/icons'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  serviceId: {
    type: [Number, String],
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  spareparts: {
    type: Array,
    required: true,
    default: () => [],
  },
  sparepartsDevice: {
    type: Array,
    required: true,
    default: () => [],
  },
  // Add new loading prop to handle parent's loading state
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'update', 'close'])

// Use internal loading state for operations specific to this component
const internalLoading = ref(false)
const existingRequests = ref([])

const formData = ref({
  spareparts: [
    {
      spareparts_devices_id: '',
      no_spareparts: '',
      quantity: 1,
    },
  ],
})

// Combined loading state for UI
const isLoading = computed(() => props.loading || internalLoading.value)

// Watch for modal visibility changes
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && props.serviceId) {
      await fetchExistingRequests()
    }
  },
)

// Update the fetchExistingRequests
const fetchExistingRequests = async () => {
  try {
    internalLoading.value = true
    const response = await axios.get(`services/${props.serviceId}/sparepart-requests`)

    existingRequests.value = response.data.data
  } catch (error) {
    showToast('Failed to load existing requests', 'error')
  } finally {
    internalLoading.value = false
  }
}

// Update the cancelRequest function with better debugging
const cancelRequest = async (requestId) => {
  try {
    // Check if requestId is valid
    if (!requestId || requestId === null || requestId === undefined) {
      showToast('Invalid request No Sparepart', 'error')
      return
    }

    internalLoading.value = true

    const url = `services/${props.serviceId}/sparepart-requests/${requestId}`
    const response = await axios.delete(url)

    if (response.data.message) {
      showToast(response.data.message, 'success')
      await fetchExistingRequests()
      emit('update')
    }
  } catch (error) {
    let errorMessage = 'Failed to cancel request'

    if (error.response?.status === 404) {
      errorMessage = 'Sparepart request not found'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    }

    showToast(errorMessage, 'error')
  } finally {
    internalLoading.value = false
  }
}

// Format price to IDR currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price)
}

// Check if a sparepart is already requested
const isPartAlreadyRequested = (no_spareparts) => {
  return existingRequests.value.some((request) => request.no_spareparts === no_spareparts)
}

// Computed property for available device types
const availableDeviceTypes = computed(() => {
  return props.sparepartsDevice.map((device) => ({
    id: device.id,
    name: device.name,
  }))
})

// Get available spareparts for a device
const availableSparepartsForDevice = computed(() => {
  return (deviceId) => {
    if (!deviceId) return []
    return props.spareparts
      .filter((part) => part.raw_device_id === deviceId)
      .map((part) => ({
        ...part,
        label: `${part.no_spareparts} - Stock: ${part.quantity}`,
      }))
  }
})

// Get maximum quantity for a sparepart
const getMaxQuantity = (no_spareparts) => {
  if (!no_spareparts) return 0
  const part = props.spareparts.find((p) => p.no_spareparts === no_spareparts)
  return part ? part.quantity : 0
}

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.value = {
    spareparts: [
      {
        spareparts_devices_id: '',
        no_spareparts: '',
        quantity: 1,
      },
    ],
  }
  existingRequests.value = []
}

const addSparepartRow = () => {
  if (formData.value.spareparts.length < 4) {
    formData.value.spareparts.push({
      spareparts_devices_id: '',
      no_spareparts: '',
      quantity: 1,
    })
  }
}

const removeSparepartRow = (index) => {
  if (formData.value.spareparts.length > 1) {
    formData.value.spareparts.splice(index, 1)
  }
}

const updateSparepartOptions = (index) => {
  formData.value.spareparts[index].no_spareparts = ''
  formData.value.spareparts[index].quantity = 1
}

const updateSparepartDetails = (index) => {
  const currentItem = formData.value.spareparts[index]
  const selectedPart = props.spareparts.find(
    (part) => part.no_spareparts === currentItem.no_spareparts,
  )

  if (selectedPart) {
    // Reset quantity to 1 or max available if less than 1
    formData.value.spareparts[index].quantity = Math.min(1, selectedPart.quantity)
  } else {
    // Reset quantity if no part selected
    formData.value.spareparts[index].quantity = 1
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showToast('Please fill all required fields correctly', 'error')
    return
  }

  internalLoading.value = true

  try {
    const requestData = {
      spareparts: formData.value.spareparts.map((item) => {
        // Ensure proper data conversion and validation
        const processedItem = {
          spareparts_devices_id: parseInt(item.spareparts_devices_id),
          no_spareparts: item.no_spareparts.trim(),
          quantity: parseInt(item.quantity),
        }

        // Validate processed item before sending
        if (!processedItem.spareparts_devices_id || isNaN(processedItem.spareparts_devices_id)) {
          throw new Error(`Invalid device ID for item: ${JSON.stringify(item)}`)
        }

        if (!processedItem.no_spareparts) {
          throw new Error(`Invalid sparepart number for item: ${JSON.stringify(item)}`)
        }

        if (!processedItem.quantity || processedItem.quantity < 1) {
          throw new Error(`Invalid quantity for item: ${JSON.stringify(item)}`)
        }

        return processedItem
      }),
    }

    const response = await axios.post(`services/${props.serviceId}/sparepart-requests`, requestData)

    if (response.data.message) {
      showToast(response.data.message, 'success')
      await fetchExistingRequests()
      emit('update')
      resetForm()
    }
  } catch (error) {
    showToast('Failed to submit sparepart request:', 'error')

    // Enhanced error logging
    if (error.response?.data) {
      // Handle validation errors specifically
      if (error.response.status === 422 && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat()
        showToast(validationErrors.join(', '), 'error')
        return
      }
    }

    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to submit request'
    showToast(errorMessage, 'error')
  } finally {
    internalLoading.value = false
  }
}
const validateForm = () => {
  return formData.value.spareparts.every(
    (item) =>
      item.spareparts_devices_id &&
      item.no_spareparts &&
      item.quantity > 0 &&
      item.quantity <= getMaxQuantity(item.no_spareparts),
  )
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="closeModal">
        <div class="modal-wrapper" @click.stop>
          <div class="modal-container">
            <div class="modal-header d-flex justify-content-between mb-4">
              <h5 class="modal-title">Request Spareparts</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>

            <!-- Loading overlay -->
            <div
              v-if="isLoading"
              class="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div class="modal-body">
              <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
                <!-- Service Info Section -->
                <div class="mb-4">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">ID</label>
                      <input type="text" class="form-control" :value="serviceId" disabled />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Customers</label>
                      <input type="text" class="form-control" :value="customerName" disabled />
                    </div>
                  </div>
                </div>

                <!-- New Spareparts Request Section -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">New Sparepart Request</h6>
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary"
                      @click="addSparepartRow"
                      :disabled="formData.spareparts.length >= 4 || isLoading"
                    >
                      <CIcon :icon="cilPlus" /> Add Sparepart
                    </button>
                  </div>

                  <div v-for="(item, index) in formData.spareparts" :key="index" class="row mb-3">
                    <!-- Device Type Selection -->
                    <div class="col-md-4">
                      <label class="form-label">Device Type</label>
                      <select
                        v-model="item.spareparts_devices_id"
                        class="form-select shadow-none"
                        required
                        @change="updateSparepartOptions(index)"
                        :disabled="isLoading"
                      >
                        <option value="">Select Device Type</option>
                        <option
                          v-for="device in availableDeviceTypes"
                          :key="device.id"
                          :value="device.id"
                        >
                          {{ device.name }}
                        </option>
                      </select>
                      <div class="invalid-feedback">Please select a device type</div>
                    </div>

                    <!-- No Sparepart Selection -->
                    <div class="col-md-4">
                      <label class="form-label">No Spareparts</label>
                      <select
                        v-model="item.no_spareparts"
                        class="form-select shadow-none"
                        required
                        :disabled="!item.spareparts_devices_id || isLoading"
                        @change="updateSparepartDetails(index)"
                      >
                        <option value="">Select No Spareparts</option>
                        <option
                          v-for="part in availableSparepartsForDevice(item.spareparts_devices_id)"
                          :key="part.id"
                          :value="part.no_spareparts"
                          :disabled="isPartAlreadyRequested(part.no_spareparts)"
                        >
                          {{ part.no_spareparts }} - Stock: {{ part.quantity }}
                          {{
                            isPartAlreadyRequested(part.no_spareparts) ? '- Already Requested' : ''
                          }}
                        </option>
                      </select>
                      <div class="invalid-feedback">Please select a sparepart</div>
                    </div>

                    <!-- Quantity Input -->
                    <div class="col-md-2">
                      <label class="form-label">Quantity</label>
                      <input
                        type="number"
                        v-model.number="item.quantity"
                        class="form-control shadow-none"
                        required
                        min="1"
                        :max="getMaxQuantity(item.no_spareparts)"
                        :disabled="!item.no_spareparts || isLoading"
                      />
                      <div class="invalid-feedback">
                        Please enter a valid quantity (1-{{ getMaxQuantity(item.no_spareparts) }})
                      </div>
                    </div>

                    <div class="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm mb-2"
                        @click="removeSparepartRow(index)"
                        :disabled="formData.spareparts.length === 1 || isLoading"
                      >
                        <CIcon :icon="cilTrash" style="color: white" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer gap-3">
              <button
                type="button"
                class="btn btn-danger text-white"
                @click="handleSubmit"
                :disabled="isLoading || !formData.spareparts.some((part) => part.no_spareparts)"
              >
                {{ isLoading ? 'Submitting...' : 'Submit Request' }}
              </button>
            </div>
            <!-- Existing Sparepart Requests Section -->
            <div v-if="existingRequests.length" class="mb-4">
              <h6 class="mb-3">Existing Sparepart Requests</h6>
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>No Spareparts</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="request in existingRequests" :key="request.id">
                      <td>{{ request.no_spareparts }}</td>
                      <td>{{ request.name }}</td>
                      <td>{{ request.quantity }}</td>
                      <td>{{ formatPrice(request.price) }}</td>
                      <td>
                        <button
                          class="btn btn-danger btn-sm text-white"
                          @click="cancelRequest(request.id)"
                          :disabled="isLoading"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-wrapper {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-container {
  padding: 1rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

input:focus,
select:focus {
  border-color: #d22c36;
  box-shadow: 0 0 0 0.2rem rgba(210, 44, 54, 0.25);
}
</style>
