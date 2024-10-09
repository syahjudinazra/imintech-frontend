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
              <label for="no_spareparts" class="form-label fw-bold">No Spareparts</label>
              <input
                v-model="editedSparepart.no_spareparts"
                type="text"
                class="form-control shadow-none"
                id="no_spareparts"
              />
            </div>
            <div class="mb-3">
              <label for="sparepartsDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="editedSparepart.spareparts_devices_id"
                :options="sparepartsDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="sparepartsDevice"
                required
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
                v-model="editedSparepart.name"
                type="text"
                class="form-control shadow-none"
                id="name"
              />
            </div>
            <div class="mb-3">
              <label for="quantity" class="form-label fw-bold">Quantity</label>
              <input
                v-model="editedSparepart.quantity"
                type="number"
                class="form-control shadow-none"
                id="quantity"
              />
            </div>
            <div class="mb-3">
              <label for="price" class="form-label fw-bold">Price</label>
              <input
                v-model="editedSparepart.price"
                type="text"
                class="form-control shadow-none"
                id="price"
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
import { ref, watch, defineProps, defineEmits, onMounted, reactive } from 'vue'
import { Modal } from 'bootstrap'
import vSelect from 'vue-select'
import { showToast } from '@/utilities/toast'
import 'vue-select/dist/vue-select.css'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  sparepart: {
    type: Object,
    default: () => ({}),
  },
  sparepartsDevice: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update', 'close'])
const isDataChanged = ref(false)
const initialSparepart = ref(null)
const editedSparepart = reactive({})
const changedFields = reactive({})

watch(
  () => props.sparepart,
  (newSparepart) => {
    if (newSparepart) {
      initialSparepart.value = cloneDeep(newSparepart)
      Object.assign(editedSparepart, cloneDeep(newSparepart))
    }
  },
  { immediate: true, deep: true },
)

watch(
  editedSparepart,
  (newValue) => {
    if (initialSparepart.value) {
      Object.keys(newValue).forEach((key) => {
        if (JSON.stringify(newValue[key]) !== JSON.stringify(initialSparepart.value[key])) {
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

  const updatedSparepart = { id: editedSparepart.id }
  Object.keys(changedFields).forEach((key) => {
    if (editedSparepart[key] !== undefined && editedSparepart[key] !== '') {
      updatedSparepart[key] = editedSparepart[key]
    }
  })

  emit('update', updatedSparepart)
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

<style scoped>
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
