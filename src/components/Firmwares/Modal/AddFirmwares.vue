<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger text-white" @click="openModal">Add Data</button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addForm"
    tabindex="-1"
    aria-labelledby="addForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addForm_label">Add Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="addFirmwares">
          <div class="modal-body">
            <div class="mb-3">
              <label for="tipe" class="form-label fw-bold">Device type</label>
              <v-select
                v-model="firmwares.firmwares_devices_id"
                :options="firmwaresDevice"
                :reduce="(device) => device.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Device Type"
                id="tipe"
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
              <label for="version" class="form-label fw-bold">Version</label>
              <input
                v-model="firmwares.version"
                type="text"
                class="form-control shadow-none"
                id="version"
                placeholder="Input version"
              />
            </div>
            <div class="mb-3">
              <label for="android" class="form-label fw-bold">Android</label>
              <v-select
                v-model="firmwares.androids_id"
                :options="androids"
                :reduce="(android) => android.id"
                label="name"
                :searchable="true"
                :clearable="false"
                placeholder="Select Android"
                id="android"
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
              <label for="flash" class="form-label fw-bold">Flash Link</label>
              <input
                v-model="firmwares.flash"
                type="text"
                class="form-control shadow-none"
                id="flash"
                placeholder="Input flash link"
              />
            </div>
            <div class="mb-3">
              <label for="ota" class="form-label fw-bold">Ota Link</label>
              <input
                v-model="firmwares.ota"
                type="text"
                class="form-control shadow-none"
                id="ota"
                placeholder="Input ota link"
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
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import { showToast } from '@/utilities/toast'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const firmwares = ref({
  firmwares_devices_id: '',
  version: '',
  androids_id: '',
  flash: '',
  ota: '',
})

const firmwaresDevice = ref([])
const androids = ref([])
let addForm

const fetchFirmwaresDevice = async () => {
  try {
    const response = await axios.get('firmwares-device')
    firmwaresDevice.value = response.data.firmwaresdevice
  } catch (error) {
    console.error('Data not found', error)
  }
}

const fetchAndroid = async () => {
  try {
    const response = await axios.get('android')
    androids.value = response.data.android
  } catch (error) {
    console.error('Data not found', error)
  }
}

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
  fetchFirmwaresDevice()
  fetchAndroid()
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

const addFirmwares = async () => {
  try {
    // Prepare form data
    const formData = new FormData()
    formData.append('firmwares_devices_id', firmwares.value.firmwares_devices_id)
    formData.append('version', firmwares.value.version)
    formData.append('androids_id', firmwares.value.androids_id)
    formData.append('flash', firmwares.value.flash)
    formData.append('ota', firmwares.value.ota)

    const response = await axios.post('firmwares', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Data added successfully:', response.data.message)
    showToast(response.data.message, 'success')
    closeModal()
  } catch (error) {
    console.error('Error add data:', error)
    showToast(error.data.message, 'error')
  }
}
</script>

<style scoped>
input:focus,
textarea:focus,
select:focus,
.v-select.vs--open .vs__dropdown-toggle {
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
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
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
</style>
