<script setup>
let viewForm

onMounted(() => {
  viewForm = new Modal(document.getElementById('viewForm'), {})
})

function openModal() {
  viewForm.show()
}

function closeModal() {
  viewForm.hide()
}
</script>

<template>
  <!-- Button trigger modal -->
  <a href="#" class="head-text text-decoration-none" @click="openModal">Lihat</a>

  <!-- Modal -->
  <div
    class="modal fade"
    id="viewForm"
    tabindex="-1"
    aria-labelledby="viewForm_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="viewForm_label">Lihat Data</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="nosparepart" class="form-label fw-bold">No Spareparts</label>
            <input
              v-model="spareparts.nosparepart"
              type="text"
              class="form-control shadow-none"
              id="nosparepart"
              placeholder="Masukan No Spareparts"
            />
          </div>
          <div class="mb-3">
            <label for="tipe" class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="spareparts.tipe"
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
              type="number"
              class="form-control shadow-none"
              id="harga"
              placeholder="Masukan Harga"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Modal } from 'bootstrap'
import { onMounted } from 'vue'

export default {
  data() {
    return {
      spareparts: {
        nosparepart: '',
        tipe: '',
        nama: '',
        quantity: '',
        harga: '',
      },
      // id: this.$route.params.id,
    }
  },
  methods: {
    async ViewDataSpareparts() {
      try {
        const response = await axios.get(`viewspareparts/${this.id}`)
        this.spareparts = response.data.data
        console.log('Data Berhasil didapat:', this.spareparts)
        this.closeModal()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    closeModal() {},
  },
  // Call ViewDataSpareparts method when component is mounted
  mounted() {
    this.ViewDataSpareparts(this.$route.params.id)
  },
}
</script>

<style scoped></style>
