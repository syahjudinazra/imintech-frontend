<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger text-white" @click="openModal">Tambah Data</button>

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
          <h5 class="modal-title" id="addForm_label">Tambah Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="nospareparts" class="form-label fw-bold">No Spareparts</label>
            <input
              v-model="spareparts.nospareparts"
              type="text"
              class="form-control shadow-none"
              id="nospareparts"
              placeholder="Masukan No Spareparts"
            />
          </div>
          <div class="mb-3">
            <label for="tipe" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="spareparts.sparepartsdevice_id"
              type="text"
              class="form-control shadow-none"
              id="tipe"
              placeholder="Masukan Tipe Device"
            />
          </div>
          <div class="mb-3">
            <label for="nama" class="form-label fw-bold">Nama</label>
            <input
              v-model="spareparts.nama"
              type="text"
              class="form-control shadow-none"
              id="nama"
              placeholder="Masukan Nama"
            />
          </div>
          <div class="mb-3">
            <label for="quantity" class="form-label fw-bold">Quantity</label>
            <input
              v-model="spareparts.quantity"
              type="number"
              class="form-control shadow-none"
              id="quantity"
              placeholder="Masukan Quantity"
            />
          </div>
          <div class="mb-3">
            <label for="harga" class="form-label fw-bold">Harga</label>
            <input
              v-model="spareparts.harga"
              type="text"
              class="form-control shadow-none"
              id="harga"
              placeholder="Masukan Harga"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary" @click="AddDataSpareparts">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'

const spareparts = ref({
  nospareparts: '',
  sparepartsdevice_id: '',
  nama: '',
  quantity: '',
  harga: '',
})

let addForm

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

async function AddDataSpareparts() {
  try {
    const response = await axios.post('spareparts', spareparts.value)
    console.log('Data saved:', response.data)
    // After saving data, you may want to close the modal
    closeModal()
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
</script>
