<template>
  <!-- Button trigger modal -->
  <a href="#" class="head-text text-decoration-none" @click="viewModal(pinjam)">Lihat</a>

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
            <label for="tanggal" class="form-label fw-bold">Tanggal</label>
            <input
              v-model="viewPinjamData.tanggal"
              type="date"
              class="form-control shadow-none"
              id="tanggal"
              placeholder="Masukan Tanggal"
            />
          </div>
          <div class="mb-3">
            <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
            <input
              v-model="viewPinjamData.serialnumber"
              type="text"
              class="form-control shadow-none"
              id="serialnumber"
              placeholder="Masukan Serial Number"
            />
          </div>
          <div class="mb-3" v-if="viewPinjamData.pinjamsdevice">
            <label class="form-label fw-bold">Tipe Device</label>
            <input
              v-model="viewPinjamData.pinjamsdevice.name"
              type="text"
              class="form-control shadow-none"
            />
          </div>
          <div class="mb-3">
            <label for="ram" class="form-label fw-bold">RAM</label>
            <input
              v-model="viewPinjamData.ram"
              type="text"
              class="form-control shadow-none"
              id="ram"
              placeholder="Masukan RAM"
            />
          </div>
          <div class="mb-3">
            <label for="android" class="form-label fw-bold">Android</label>
            <input
              v-model="viewPinjamData.android"
              type="text"
              class="form-control shadow-none"
              id="android"
              placeholder="Masukan Android"
            />
          </div>
          <div class="mb-3">
            <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
            <input
              v-model="viewPinjamData.pelanggan"
              type="text"
              class="form-control shadow-none"
              id="pelanggan"
              placeholder="Masukan Pelanggan"
            />
          </div>
          <div class="mb-3">
            <label for="alamat" class="form-label fw-bold">Alamat</label>
            <textarea
              v-model="viewPinjamData.alamat"
              class="form-control shadow-none"
              id="alamat"
              placeholder="Masukan Alamat"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="sales" class="form-label fw-bold">Sales</label>
            <input
              v-model="viewPinjamData.sales"
              type="text"
              class="form-control shadow-none"
              id="sales"
              placeholder="Masukan Sales"
            />
          </div>
          <div class="mb-3">
            <label for="no_telp" class="form-label fw-bold">No Telp</label>
            <input
              v-model="viewPinjamData.no_telp"
              type="text"
              class="form-control shadow-none"
              id="no_telp"
              placeholder="Masukan No Telp"
            />
          </div>
          <div class="mb-3">
            <label for="pengirim" class="form-label fw-bold">Pengirim</label>
            <input
              v-model="viewPinjamData.pengirim"
              type="text"
              class="form-control shadow-none"
              id="pengirim"
              placeholder="Masukan Pengirim"
            />
          </div>
          <div class="mb-3">
            <label for="kelengkapankirim" class="form-label fw-bold">Kelengkapan Kirim</label>
            <textarea
              v-model="viewPinjamData.kelengkapankirim"
              class="form-control shadow-none"
              id="kelengkapankirim"
              placeholder="Masukan Kelengkapan Kirim"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="status" class="form-label fw-bold">Status</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="status"
                v-model="viewPinjamData.status"
              />
              <label class="form-check-label" for="status">Dipinjamkan</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'

const viewForm = ref(null)
const viewPinjamData = ref({})
const pinjams = ref([])

onMounted(() => {
  viewForm.value = new Modal(document.getElementById('viewForm'), {})
  getDevicesPinjam()
})

const viewModal = (pinjam) => {
  viewPinjamData.value = { ...pinjam }
  viewForm.value.show()
}

const closeModal = () => {
  viewForm.value.hide()
}

const getDevicesPinjam = async () => {
  try {
    const response = await axios.get('getpinjam')
    pinjams.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}
</script>
