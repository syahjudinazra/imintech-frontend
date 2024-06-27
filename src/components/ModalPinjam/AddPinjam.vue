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
        <form @submit.prevent="addPinjam">
          <div class="modal-body">
            <div class="mb-3">
              <label for="tanggal" class="form-label fw-bold">Tanggal</label>
              <input
                v-model="pinjams.tanggal"
                type="date"
                class="form-control shadow-none"
                id="tanggal"
                placeholder="Masukan Tanggal"
              />
            </div>
            <div class="mb-3">
              <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="pinjams.serialnumber"
                type="text"
                class="form-control shadow-none"
                id="serialnumber"
                placeholder="Masukan Serial Number"
              />
            </div>
            <div class="mb-3">
              <label class="fw-bold" for="pinjamsdevice_id">Tipe Device</label>
              <select
                class="form-select form-control-chosen shadow-none"
                name="pinjamsdevice_id"
                id="pinjamsdevice_id"
                v-model="pinjams.pinjamsdevice_id"
                required
              >
                <option value="" disabled selected>Pilih Tipe Device</option>
                <option v-for="device in pinjamsdevice" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="ram" class="form-label fw-bold">RAM</label>
              <input
                v-model="pinjams.ram"
                type="text"
                class="form-control shadow-none"
                id="ram"
                placeholder="Masukan RAM"
              />
            </div>
            <div class="mb-3">
              <label for="android" class="form-label fw-bold">Android</label>
              <input
                v-model="pinjams.android"
                type="text"
                class="form-control shadow-none"
                id="android"
                placeholder="Masukan Android"
              />
            </div>
            <div class="mb-3">
              <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
              <input
                v-model="pinjams.pelanggan"
                type="text"
                class="form-control shadow-none"
                id="pelanggan"
                placeholder="Masukan Pelanggan"
              />
            </div>
            <div class="mb-3">
              <label for="alamat" class="form-label fw-bold">Alamat</label>
              <textarea
                v-model="pinjams.alamat"
                class="form-control shadow-none"
                id="alamat"
                placeholder="Masukan Alamat"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="sales" class="form-label fw-bold">Sales</label>
              <input
                v-model="pinjams.sales"
                type="text"
                class="form-control shadow-none"
                id="sales"
                placeholder="Masukan Sales"
              />
            </div>
            <div class="mb-3">
              <label for="no_telp" class="form-label fw-bold">No Telp</label>
              <input
                v-model="pinjams.no_telp"
                type="text"
                class="form-control shadow-none"
                id="no_telp"
                placeholder="Masukan No Telp"
              />
            </div>
            <div class="mb-3">
              <label for="pengirim" class="form-label fw-bold">Pengirim</label>
              <input
                v-model="pinjams.pengirim"
                type="text"
                class="form-control shadow-none"
                id="pengirim"
                placeholder="Masukan Pengirim"
              />
            </div>
            <div class="mb-3">
              <label for="kelengkapankirim" class="form-label fw-bold">Kelengkapan Kirim</label>
              <textarea
                v-model="pinjams.kelengkapankirim"
                class="form-control shadow-none"
                id="kelengkapankirim"
                placeholder="Masukan Kelengkapan Kirim"
              ></textarea>
            </div>
            <div class="mb-3" hidden>
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="status"
                  v-model="pinjams.status"
                  :true-value="'Dipinjamkan'"
                  :false-value="'Dipinjamkan'"
                  checked
                />
                <label class="form-check-label" for="status">Dipinjamkan</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn btn-primary">Submit</button>
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
import Swal from 'sweetalert2'

const pinjams = ref({
  tanggal: '',
  serialnumber: '',
  pinjamsdevice_id: '',
  ram: '',
  android: '',
  pelanggan: '',
  alamat: '',
  sales: '',
  no_telp: '',
  pengirim: '',
  kelengkapankirim: '',
  status: 'Dipinjamkan',
})

const pinjamsdevice = ref([])

let addForm

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
  fetchDevice()
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

const addPinjam = async () => {
  try {
    const response = await axios.post('addpinjam', pinjams.value)
    console.log('Data berhasil ditambahkan:', response.data)
    await showNotification('success', response.data.message)
    closeModal()
  } catch (error) {
    console.error('Data gagal ditambahkan', error)
    const message = error.response?.data?.message || 'Terjadi kesalahan'
    await showNotification('error', message)
    closeModal()
  }
}

const fetchDevice = async () => {
  try {
    const response = await axios.get('getlistpinjam')
    pinjamsdevice.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

function showNotification(type, message) {
  return new Promise((resolve) => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
      didClose: () => {
        window.location.reload()
      },
    })
    toast
      .fire({
        icon: type,
        title: message,
      })
      .then(() => {
        resolve()
      })
  })
}
</script>

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}
</style>
