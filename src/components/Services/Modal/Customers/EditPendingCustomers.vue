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
              <div class="form-group mb-3">
                <label class="fw-bold">Owner</label><br />
                <div class="form-check form-check-inline">
                  <input
                    v-model="editedService.owner"
                    class="form-check-input mt-1"
                    type="radio"
                    id="stocks"
                    value="Stocks"
                  />
                  <label class="form-check-label" for="stocks">Stocks</label>
                </div>
                <div class="form-check form-check-inline mb-3">
                  <input
                    v-model="editedService.owner"
                    class="form-check-input mt-1"
                    type="radio"
                    id="customers"
                    value="Customers"
                  />
                  <label class="form-check-label" for="customers">Customers</label>
                </div>
              </div>
              <label for="serviceDevice" class="form-label fw-bold">Device Type</label>
              <v-select
                v-model="editedService.services_devices_id"
                :options="servicesDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="serviceDevice"
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
              <label for="serial_number" class="form-label fw-bold">Serial number</label>
              <input
                v-model="editedService.serial_number"
                type="text"
                class="form-control shadow-none"
                id="serial_number"
                required
              />
            </div>
            <div class="mb-3">
              <label for="usage" class="form-label fw-bold">Usage</label>
              <v-select
                v-model="editedService.usages_id"
                :options="usages"
                :reduce="(usage) => usage.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Usages"
                id="usage"
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
              <label for="damage" class="form-label fw-bold">Damage</label>
              <textarea
                v-model="editedService.damage"
                type="text"
                class="form-control shadow-none"
                id="damage"
              /><textarea />
            </div>
            <div class="mb-3">
              <label class="fw-bold" for="date_in_services">Date of Entry</label>
              <VueDatePicker v-model="editedService.date_in_services" />
            </div>
            <div class="mb-3">
              <label for="note" class="form-label fw-bold">Note</label>
              <textarea
                v-model="editedService.note"
                type="text"
                class="form-control shadow-none"
                id="note"
              /><textarea />
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
  service: {
    type: Object,
    default: () => ({}),
  },
  servicesDevice: {
    type: Array,
    default: () => [],
  },
  usages: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update', 'close'])
const isDataChanged = ref(false)
const initialService = ref(null)
const editedService = reactive({})
const changedFields = reactive({})

watch(
  () => props.service,
  (newService) => {
    if (newService) {
      initialService.value = cloneDeep(newService)
      Object.assign(editedService, cloneDeep(newService))
    }
  },
  { immediate: true, deep: true },
)

watch(
  editedService,
  (newValue) => {
    if (initialService.value) {
      Object.keys(newValue).forEach((key) => {
        if (JSON.stringify(newValue[key]) !== JSON.stringify(initialService.value[key])) {
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

  const updatedService = { id: editedService.id }
  Object.keys(changedFields).forEach((key) => {
    updatedService[key] = editedService[key]
  })

  if (updatedService.usages_id) {
    updatedService.usage = updatedService.usages_id
  }

  emit('update', updatedService)
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
