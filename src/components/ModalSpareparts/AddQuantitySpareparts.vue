<template>
  <!-- Button trigger modal -->
  <a class="dropdown-item" href="#" @click="openModal">Tambah Quantity</a>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addQuantityForm"
    tabindex="-1"
    aria-labelledby="addQuantityForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addQuantityForm_label">Tambah Quantity</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body d-flex justify-content-center">
          <input class="addquan text-center" type="number" id="quantity" name="quantity" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary" @click="AddQuantitySpareparts">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Modal } from 'bootstrap'

let addQuantityForm

onMounted(() => {
  addQuantityForm = new Modal(document.getElementById('addQuantityForm'), {})
})

function openModal() {
  addQuantityForm.show()
}

function closeModal() {
  addQuantityForm.hide()
}
</script>

<style scoped>
.addquan {
  width: 20%;
  height: 4rem;
  font-size: 2rem;
}
</style>
