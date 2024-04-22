<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-danger text-white" @click="openModal">Tambah Data</button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addDataSpareparts"
    tabindex="-1"
    aria-labelledby="addDataSpareparts_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addDataSpareparts_label">Tambah Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="nospareparts" class="form-label fw-bold">No Spareparts</label>
            <input
              type="text"
              class="form-control shadow-none"
              id="nospareparts"
              placeholder="Masukan No Spareparts"
            />
          </div>
          <div class="mb-3">
            <label for="tipe" class="form-label fw-bold">Tipe Device</label>
            <input
              type="text"
              class="form-control shadow-none"
              id="tipe"
              placeholder="Masukan Tipe Device"
            />
          </div>
          <div class="mb-3">
            <label for="nama" class="form-label fw-bold">Nama</label>
            <input
              type="text"
              class="form-control shadow-none"
              id="nama"
              placeholder="Masukan Nama"
            />
          </div>
          <div class="mb-3">
            <label for="quantity" class="form-label fw-bold">Quantity</label>
            <input
              type="number"
              class="form-control shadow-none"
              id="quantity"
              placeholder="Masukan Quantity"
            />
          </div>
          <div class="mb-3">
            <label for="harga" class="form-label fw-bold">Harga</label>
            <input
              type="text"
              class="form-control shadow-none"
              id="harga"
              placeholder="Masukan Harga"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const state = reactive({
  addDataSpareparts: null,
})

onMounted(() => {
  state.addDataSpareparts = new Modal(document.getElementById('addDataSpareparts'), {})
})

function openModal() {
  state.addDataSpareparts.show()
}

function closeModal() {
  state.addDataSpareparts.hide()
}
</script>
