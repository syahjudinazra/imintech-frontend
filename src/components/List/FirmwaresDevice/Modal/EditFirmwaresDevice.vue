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
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Name</label>
              <input
                v-model="editedFirmwaresDevice.name"
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
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  firmwaresDevice: Object,
})

const emit = defineEmits(['update', 'close'])

const editedFirmwaresDevice = ref({ ...props.firmwaresDevice })
const loading = ref(false)

watch(
  () => props.firmwaresDevice,
  (newValue) => {
    editedFirmwaresDevice.value = { ...newValue }
  },
  { deep: true },
)

let editModal

const handleSubmit = async () => {
  try {
    loading.value = true
    await editForm()
  } catch (error) {
    console.error('Error updating device:', error)
  } finally {
    loading.value = false
  }
}

const editForm = async () => {
  emit('update', editedFirmwaresDevice.value)
}

const closeModal = () => {
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
  editModal = new Modal(document.getElementById('editForm'))
})
</script>

<style scoped>
input:focus {
  border-color: #d22c36;
}
</style>
