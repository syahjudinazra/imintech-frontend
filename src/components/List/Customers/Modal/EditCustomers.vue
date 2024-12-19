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
            <div class="mb-3">
              <label for="name" class="form-label fw-bold">Name</label>
              <input
                v-model="editedCustomer.name"
                type="text"
                class="form-control shadow-none"
                id="name"
              />
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label fw-bold">Phone</label>
              <input
                v-model="editedCustomer.phone"
                type="number"
                class="form-control shadow-none"
                id="phone"
              />
            </div>
            <div class="mb-3">
              <label for="address" class="form-label fw-bold">Address</label>
              <textarea
                v-model="editedCustomer.address"
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
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  customers: Object,
})

const emit = defineEmits(['update', 'close'])
const editedCustomer = ref({ ...props.customers })

watch(
  () => props.customers,
  (newValue) => {
    editedCustomer.value = { ...newValue }
  },
  { deep: true },
)

let editModal

const editForm = () => {
  emit('update', editedCustomer.value)
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
