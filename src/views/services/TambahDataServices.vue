<template>
  <div class="container w-50 p-3">
    <div class="row addDataForms">
      <div class="d-flex justify-content-between mb-2">
        <h1 class="h3 mb-3 text-gray-800">Tambah Data Service</h1>
        <button
          @click.prevent="exportService"
          :class="['btn btn-success btn-sm fw-bold text-white', { disabled: isLoading }]"
          :aria-disabled="isLoading"
        >
          <span v-if="isLoading">Downloading...</span>
          <span v-else>Download Excel</span>
        </button>
      </div>
      <hr style="width: -webkit-fill-available" />
      <form @submit.prevent="addNewServices" class="mb-4" enctype="multipart/form-data">
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
            <option value="" disabled selected>Pilih Tipe Device</option>
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
            <option value="" disabled selected>Pilih Lama Pemakaian</option>
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
        <div class="form-group mb-3" hidden>
          <label for="status" class="form-label fw-bold">Status</label>
          <div class="d-flex gap-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="status"
                v-model="services.status"
              />
              <label class="form-check-label" for="status">Antrian</label>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  catatan: 'Tanggal Pembelian:\nKelengkapan:',
  status: 'Antrian',
})

const servicesdevice = ref([])
const isLoading = ref(false)

const fetchDevices = () => {
  axios
    .get('getlistservices')
    .then((response) => {
      servicesdevice.value = response.data.data
    })
    .catch((error) => {
      console.log(error)
    })
}

const addNewServices = () => {
  axios
    .post('addservices', services.value)
    .then((response) => {
      console.log(response)
      services.value = response.data.data
      showNotification('success', 'Data berhasil ditambahkan')
      clearInput()
    })
    .catch((error) => {
      console.log(error)
      showNotification('error', 'Data gagal ditambahkan')
    })
}

const clearInput = () => {
  services.value = {
    serialnumber: '',
    tanggalmasuk: '',
    pemilik: '',
    pelanggan: '',
    servicesdevice_id: '',
    pemakaian: '',
    kerusakan: '',
    catatan: '',
  }
}

const exportService = () => {
  isLoading.value = true
  axios
    .get('services/export', { responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'services.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showNotification('success', 'Export Excel Berhasil')
    })
    .catch((error) => {
      console.log(error)
      showNotification('error', 'Export Excel Gagal')
    })
    .finally(() => {
      isLoading.value = false
    })
}

const showNotification = (type, message) => {
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

const handleRadioChange = (isStock) => {
  services.value.pelanggan = isStock ? 'iMin ID' : null
}

onMounted(() => {
  const stockRadio = document.getElementById('stock')
  const customerRadio = document.getElementById('customer')

  // Add event listeners to radio buttons
  stockRadio.addEventListener('change', () => {
    handleRadioChange(stockRadio.checked)
  })

  customerRadio.addEventListener('change', () => {
    handleRadioChange(!customerRadio.checked)
  })

  fetchDevices()
})
</script>

<style scoped>
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}

.addDataForms {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1rem;
}

.disabled {
  pointer-events: none;
  opacity: 0.65;
}
</style>
