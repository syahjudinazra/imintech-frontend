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
              <label for="tipe" class="form-label fw-bold">Tipe Device</label>
              <select
                v-model="firmwares.firmwares_devices_id"
                class="form-control shadow-none"
                id="tipe"
              >
                <option value="" disabled>Select Device Type</option>
                <option v-for="device in firmwaresDevice" :key="device.id" :value="device.id">
                  {{ device.name }}
                </option>
              </select>
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
              <select v-model="firmwares.androids_id" class="form-control shadow-none" id="android">
                <option value="" disabled>Select Android</option>
                <option v-for="android in androids" :key="android.id" :value="android.id">
                  {{ android.name }}
                </option>
              </select>
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
                placeholder="Input Ota link"
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
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}
select:focus {
  border-color: #d22c36;
}
</style>
