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

                <!-- Spareparts Section -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">Requested Spareparts</h6>
                    <button type="button" class="btn btn-sm btn-secondary" @click="addSparepartRow">
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
                        :disabled="!item.spareparts_devices_id"
                        @change="updateSparepartDetails(index)"
                      >
                        <option value="">Select No Spareparts</option>
                        <option
                          v-for="part in getAvailableSparepartsForDevice(
                            item.spareparts_devices_id,
                          )"
                          :key="part.id"
                          :value="part.no_spareparts"
                        >
                          {{ part.no_spareparts }} - {{ part.name }} (Stock: {{ part.quantity }},
                          Price: ${{ part.price }})
                        </option>
                      </select>
                      <div class="invalid-feedback">Please select a sparepart</div>
                    </div>

                    <!-- Quantity Input -->
                    <div class="col-md-3">
                      <label class="form-label">Quantity</label>
                      <input
                        type="number"
                        v-model.number="item.quantity"
                        class="form-control shadow-none"
                        required
                        min="1"
                        :max="getMaxQuantity(item.no_spareparts)"
                        :disabled="!item.no_spareparts"
                      />
                      <div class="invalid-feedback">
                        Please enter a valid quantity (1-{{ getMaxQuantity(item.no_spareparts) }})
                      </div>
                    </div>

                    <!-- Remove Button -->
                    <div class="col-md-1 d-flex align-items-end">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm mb-2"
                        @click="removeSparepartRow(index)"
                        :disabled="formData.spareparts.length === 1"
                      >
                        <CIcon :icon="cilTrash" style="color: white" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer gap-3">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button
                type="button"
                class="btn btn-danger text-white"
                @click="handleSubmit"
                :disabled="loading"
              >
                {{ loading ? 'Submitting...' : 'Submit Request' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
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
})

const emit = defineEmits(['update:modelValue', 'update', 'close'])

const loading = ref(false)

const formData = ref({
  spareparts: [
    {
      spareparts_devices_id: '',
      no_spareparts: '',
      quantity: 1,
    },
  ],
})

// Computed property for available device types
const availableDeviceTypes = computed(() => {
  // Get unique device IDs and names from spareparts
  const uniqueDevices = [...new Set(props.spareparts.map((part) => part.spareparts_devices_id))]
  return uniqueDevices.map((deviceId) => ({
    id: deviceId,
    name: deviceId, // Using the ID as name since that's what we see in the image
  }))
})

// Method to get available spareparts for selected device
const getAvailableSparepartsForDevice = (deviceId) => {
  if (!deviceId) return []
  return props.spareparts.filter(
    (part) =>
      part.spareparts_devices_id === deviceId &&
      part.quantity > 0 &&
      part.name &&
      part.no_spareparts,
  )
}

// Method to get max quantity for a specific sparepart
const getMaxQuantity = (no_spareparts) => {
  if (!no_spareparts) return 0
  const part = props.spareparts.find((p) => p.no_spareparts === no_spareparts)
  return part ? part.quantity : 0
}

// Rest of the methods remain the same
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
}

const addSparepartRow = () => {
  formData.value.spareparts.push({
    spareparts_devices_id: '',
    no_spareparts: '',
    quantity: 1,
  })
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
  formData.value.spareparts[index].quantity = 1
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showToast('Please fill all required fields correctly', 'error')
    return
  }

  loading.value = true
  try {
    // Ensure all values are properly formatted
    const requestData = {
      spareparts: formData.value.spareparts.map((item) => ({
        spareparts_devices_id: Number(item.spareparts_devices_id) || null,
        no_spareparts: item.no_spareparts,
        quantity: Number(item.quantity),
      })),
    }

    // Add CSRF token to headers
    const config = {
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]'),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }

    const response = await axios.post(
      `services/${props.serviceId}/sparepart-requests`,
      requestData,
      config,
    )

    if (response.data.message) {
      showToast(response.data.message, 'success')
      emit('update')
      closeModal()
    }
  } catch (error) {
    console.error('Failed to submit sparepart request:', error)
    const errorMessage = error.response?.data?.message || 'Failed to submit request'
    showToast(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

// Add form validation function
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

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}

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
</style>
