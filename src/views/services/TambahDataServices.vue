<template>
  <div class="container w-50 p-3">
    <div class="row addDataForms">
      <div class="d-flex justify-content-between mb-2">
        <h1 class="h3 mb-3 text-gray-800">Tambah Data Service</h1>
      </div>
      <hr style="width: -webkit-fill-available" />
      <form @submit.prevent="addServices" class="mb-4" enctype="multipart/form-data">
        <div class="form-group mb-3">
          <label class="fw-bold" for="serialnumber">Serial Number</label>
          <input
            type="text"
            class="form-control shadow-none"
            id="serialnumber"
            name="serialnumber"
            placeholder="Masukan Serial Number"
            v-model="services.serialnumber"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="tanggalmasuk">Tanggal Masuk</label>
          <input
            type="date"
            class="form-control shadow-none"
            id="tanggalmasuk"
            name="tanggalmasuk"
            v-model="services.tanggalmasuk"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="pemilik">Pemilik</label><br />
          <div class="form-check form-check-inline">
            <input
              class="form-check-input mt-1"
              type="radio"
              id="stock"
              name="pemilik"
              value="stock"
              v-model="services.pemilik"
            />
            <label class="form-check-label" for="stock">Stock</label>
          </div>
          <div class="form-check form-check-inline mb-3">
            <input
              class="form-check-input mt-1"
              type="radio"
              id="customer"
              name="pemilik"
              value="customer"
              v-model="services.pemilik"
            />
            <label class="form-check-label" for="customer">Customer</label>
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="pelanggan">Pelanggan</label>
          <input
            type="text"
            class="form-control shadow-none"
            id="pelanggan"
            name="pelanggan"
            placeholder="Masukan Pelanggan"
            v-model="services.pelanggan"
            required
          />
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="servicesdevice_id">Tipe Device</label>
          <select
            class="form-select form-control-chosen shadow-none"
            name="servicesdevice_id"
            id="servicesdevice_id"
            v-model="services.servicesdevice_id"
            required
          >
            <option value="Null" selected>Pilih Tipe Device</option>
            <option v-for="device in servicesdevice" :value="device.id" :key="device.id">
              {{ device.name }}
            </option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="pemakaian">Lama Pemakaian</label>
          <select
            class="form-select shadow-none"
            name="pemakaian"
            id="pemakaian"
            v-model="services.pemakaian"
            required
          >
            <option value="Null" selected>Pilih Lama Pemakaian</option>
            <option value="Baru Di Unboxing">Baru Di Unboxing</option>
            <option value="7 Hari Kurang">7 Hari Kurang</option>
            <option value="1 Tahun Kurang">1 Tahun Kurang</option>
            <option value="1 Tahun Lebih">1 Tahun Lebih</option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="kerusakan">Kerusakan</label>
          <textarea
            type="text"
            class="form-control shadow-none"
            id="kerusakan"
            name="kerusakan"
            placeholder="Masukan Kerusakan"
            v-model="services.kerusakan"
            required
          ></textarea>
        </div>
        <div class="form-group mb-3">
          <label class="fw-bold" for="catatan">Catatan</label>
          <textarea
            type="text"
            class="form-control shadow-none"
            id="catatan"
            name="catatan"
            v-model="services.catatan"
            required
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const services = ref({
  serialnumber: '',
  tanggalmasuk: '',
  pemilik: '',
  pelanggan: '',
  servicesdevice_id: '',
  pemakaian: '',
  kerusakan: '',
  catatan: '',
})

const servicesdevice = ref([])

async function addServices() {
  try {
    const response = await axios.post('addservices', services.value)
    console.log('Data saved:', response.data)
    showNotification('success', response.data.message)
  } catch (error) {
    console.error('Error saving data:', error)
    showNotification('error', error.response.data.message)
  }
}

async function fetchDevices() {
  try {
    const response = await axios.get('getlistservices')
    servicesdevice.value = response.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

function showNotification(type, message) {
  return new Promise((resolve) => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
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

fetchDevices()
</script>

<style scoped>
.addDataForms {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1rem;
}
</style>
