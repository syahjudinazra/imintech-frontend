<template>
  <div>
    <div
      class="modal fade"
      id="quantityModal"
      tabindex="-1"
      aria-labelledby="quantityModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="quantityModalLabel">{{ modalTitle }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body d-flex justify-content-center">
              <input
                v-model="quantityChange"
                class="addquan text-center"
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                required
              />
            </div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-danger btn-sm text-white"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button class="btn btn-success btn-sm text-white" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'

const props = defineProps({
  sparepart: {
    type: Object,
    required: true,
  },
  action: {
    type: String,
    required: true,
    validator: (value) => ['add', 'reduce'].includes(value),
  },
})

const emit = defineEmits(['update', 'close'])

const quantityChange = ref(1)
const modalTitle = computed(() => (props.action === 'add' ? 'Add Quantity' : 'Reduce Quantity'))

const modalInstance = ref(null)

onMounted(() => {
  const modalElement = document.getElementById('quantityModal')
  if (modalElement) {
    modalInstance.value = new Modal(modalElement)
  }
})

onUnmounted(() => {
  if (modalInstance.value) {
    modalInstance.value.dispose()
  }
})

const handleSubmit = async () => {
  try {
    const response = await axios.put(`spareparts/${props.sparepart.id}/update-quantity`, {
      quantity: quantityChange.value,
      action: props.action,
    })

    showToast(response.data.message, 'success')
    emit('update', response.data.new_quantity)
    hideModal()
  } catch (error) {
    console.error('Failed to update quantity', error)
    showToast(error.response?.data?.error || 'Failed to update quantity', 'error')
  }
}

const showModal = () => {
  if (modalInstance.value) {
    modalInstance.value.show()
  }
}

const hideModal = () => {
  if (modalInstance.value) {
    modalInstance.value.hide()
  }
}

defineExpose({ showModal, hideModal })
</script>

<style scoped>
input {
  height: 4rem;
  width: 6rem;
  font-size: 2rem;
}
</style>
