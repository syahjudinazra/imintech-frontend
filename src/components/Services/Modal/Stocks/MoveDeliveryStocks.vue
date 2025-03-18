<script setup>
import { ref, watch, onMounted, reactive } from 'vue'
import { Modal } from 'bootstrap'
import { showToast } from '@/utilities/toast'
import { cloneDeep } from 'lodash-es'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  service: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['update', 'close'])
//Reff

// State
const isDataChanged = ref(false)
const initialService = ref(null)
const movedService = reactive({})
const changedFields = reactive({})
let moveModal = null

const moveForm = async () => {
  if (!isDataChanged.value) {
    showToast('No changes detected.', 'error')
    return
  }

  // Prepare payload with explicitly set status
  const payload = {
    no_resi: movedService.no_resi || '',
    expedition: movedService.expedition || '',
    status: 'Done Stocks',
  }

  emit('update', payload)
  hideModal()
}

// Reset form
const resetForm = () => {
  Object.keys(changedFields).forEach((key) => delete changedFields[key])
  isDataChanged.value = false
}

// Modal handlers
const showModal = () => {
  moveModal?.show()
}

const hideModal = () => {
  resetForm()
  moveModal?.hide()
}

const closeModal = () => {
  resetForm()
  hideModal()
  emit('close')
}

// Watchers
watch(
  () => props.service,
  (newService) => {
    if (newService) {
      initialService.value = cloneDeep(newService)

      const serviceClone = cloneDeep(newService)
      Object.assign(movedService, serviceClone)
    }
  },
  { immediate: true, deep: true },
)

watch(
  movedService,
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

// Lifecycle
onMounted(() => {
  moveModal = new Modal(document.getElementById('moveForm'))
})

// Expose methods
defineExpose({
  showModal,
  hideModal,
})
</script>

<template>
  <div
    class="modal fade"
    id="moveForm"
    tabindex="-1"
    aria-labelledby="moveForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="moveForm_label">Move Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal" />
        </div>
        <form @submit.prevent="moveForm">
          <div class="modal-body">
            <!--Resi Number-->
            <div class="mb-3">
              <label for="no_resi" class="form-label fw-bold">Resi Number</label>
              <input
                v-model="movedService.no_resi"
                class="form-control shadow-none"
                id="no_resi"
                placeholder="Input Resi Number"
              />
            </div>

            <!--Expedition-->
            <div class="mb-3">
              <label for="expedition" class="form-label fw-bold">Expedition</label>
              <input
                v-model="movedService.expedition"
                class="form-control shadow-none"
                id="expedition"
                placeholder="Input Expedition"
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

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
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
