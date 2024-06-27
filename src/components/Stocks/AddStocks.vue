<template>
  <button type="button" class="btn btn-danger text-white" @click="openModal">Tambah Data</button>

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
        <form @submit.prevent="addStocks" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="serialnumber" class="form-label fw-bold">Serial Number</label>
              <input
                v-model="stocks.serialnumber"
                type="text"
                class="form-control shadow-none"
                id="serialnumber"
                placeholder="Masukan Serial Number"
              />
            </div>
            <div class="mb-3">
              <label class="fw-bold" for="stocksdevice_id">Tipe Device</label>
              <select
                class="form-select form-control-chosen shadow-none"
                id="stocksdevice_id"
                v-model="stocks.stocksdevice_id"
              >
                <option value="" disabled selected>Pilih Tipe Device</option>
                <option v-for="device in stocksdevice" :value="device.id" :key="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="fw-bold" for="stocks_sku_id">SKU</label>
              <select
                class="form-select form-control-chosen shadow-none"
                id="stocks_sku_id"
                v-model="stocks.stocks_sku_id"
              >
                <option value="" disabled selected>Pilih SKU</option>
                <option v-for="sku in stockssku" :value="sku.id" :key="sku.id">
                  {{ sku.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="noinvoice" class="form-label fw-bold">No Invoice</label>
              <input
                v-model="stocks.noinvoice"
                type="text"
                class="form-control shadow-none"
                id="noinvoice"
                placeholder="Masukan No Invoice"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="tanggalmasuk">Tanggal Masuk</label>
              <input
                type="date"
                class="form-control shadow-none"
                id="tanggalmasuk"
                v-model="stocks.tanggalmasuk"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="tanggalkeluar">Tanggal Keluar</label>
              <input
                type="date"
                class="form-control shadow-none"
                id="tanggalkeluar"
                v-model="stocks.tanggalkeluar"
              />
            </div>
            <div class="mb-3">
              <label for="pelanggan" class="form-label fw-bold">Pelanggan</label>
              <input
                v-model="stocks.pelanggan"
                type="text"
                class="form-control shadow-none"
                id="pelanggan"
                placeholder="Masukan Pelanggan"
              />
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="lokasi">Lokasi</label>
              <select class="form-select shadow-none" id="lokasi" v-model="stocks.lokasi">
                <option value="" disabled selected>Pilih Lokasi</option>
                <option value="A01">A01</option>
                <option value="A02">A02</option>
                <option value="B01">B01</option>
                <option value="B02">B02</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="fw-bold" for="keterangan">Keterangan</label>
              <textarea
                class="form-control shadow-none"
                id="keterangan"
                v-model="stocks.keterangan"
                placeholder="Masukan Keterangan"
              ></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="status" class="form-label fw-bold">Status</label>
              <div class="d-flex gap-2">
                <div class="form-check" v-for="status in statuses" :key="status">
                  <input
                    class="form-check-input"
                    type="radio"
                    :id="status"
                    :value="status"
                    v-model="stocks.status"
                  />
                  <label class="form-check-label" :for="status">{{ status }}</label>
                </div>
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

const stocks = ref({
  serialnumber: '',
  stocksdevice_id: '',
  stocks_sku_id: '',
  noinvoice: '',
  tanggalmasuk: '',
  tanggalkeluar: '',
  pelanggan: '',
  lokasi: '',
  keterangan: '',
  status: '',
})

const stocksdevice = ref([])
const stockssku = ref([])
const statuses = ref(['Gudang', 'Diservice', 'Dipinjam', 'Terjual'])

let addForm

onMounted(() => {
  addForm = new Modal(document.getElementById('addForm'), {})
  fetchDevices()
  fetchStocksSku()
})

function openModal() {
  addForm.show()
}

function closeModal() {
  addForm.hide()
}

const clearInput = () => {
  stocks.value = {
    serialnumber: '',
    stocksdevice_id: '',
    stocks_sku_id: '',
    noinvoice: '',
    tanggalmasuk: '',
    tanggalkeluar: '',
    pelanggan: '',
    lokasi: '',
    keterangan: '',
    status: '',
  }
}

const addStocks = async () => {
  try {
    const response = await axios.post('addstocks', stocks.value)
    console.log('Data berhasil ditambahkan:', response.data)
    showNotification('success', response.data.message)
    clearInput()
    closeModal()
  } catch (error) {
    console.error('Data gagal ditambahkan', error)
    showNotification('error', error.response.data.message)
    closeModal()
  }
}

const fetchDevices = async () => {
  try {
    const response = await axios.get('getliststocks')
    stocksdevice.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

const fetchStocksSku = async () => {
  try {
    const response = await axios.get('getliststockssku')
    stockssku.value = response.data.data
  } catch (error) {
    console.error('Data gagal ditemukan', error)
  }
}

function showNotification(type, message) {
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
  })
  toast.fire({
    icon: type,
    title: message,
  })
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
