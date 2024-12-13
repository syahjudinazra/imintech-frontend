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
        <form @submit.prevent="updateCustomers" enctype="multipart/form-data">
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
import { ref, watch, defineProps, defineEmits, onMounted, reactive } from 'vue'
import { Modal } from 'bootstrap'
import { showToast } from '@/utilities/toast'
import 'vue-select/dist/vue-select.css'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  customer: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update', 'close'])
const isDataChanged = ref(false)
const initialCustomer = ref(null)
const editedCustomer = reactive({})
const changedFields = reactive({})

watch(
  () => props.customer,
  (newCustomer) => {
    if (newCustomer) {
      initialCustomer.value = cloneDeep(newCustomer)
      Object.assign(editedCustomer, cloneDeep(newCustomer))
    }
  },
  { immediate: true, deep: true },
)

watch(
  editedCustomer,
  (newValue) => {
    if (initialCustomer.value) {
      Object.keys(newValue).forEach((key) => {
        if (JSON.stringify(newValue[key]) !== JSON.stringify(initialCustomer.value[key])) {
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

const updateCustomers = () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  const updatedCustomer = { id: editedCustomer.id }
  Object.keys(changedFields).forEach((key) => {
    if (editedCustomer[key] !== undefined && editedCustomer[key] !== '') {
      updatedCustomer[key] = editedCustomer[key]
    }
  })

  emit('update', updatedCustomer)
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
  editModal = new Modal(document.getElementById('editForm'))
})
</script>
