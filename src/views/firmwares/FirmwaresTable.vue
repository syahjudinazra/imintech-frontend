<template>
  <div class="container-fluid">
    <AddFirmwares />
    <div class="table-responsive">
      <table class="table caption-top">
        <caption class="fw-bold">
          List of Firmwares
        </caption>
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Tipe</th>
            <th>Versi</th>
            <th>Android</th>
            <th>Flash</th>
            <th>Ota</th>
            <th>Kategori</th>
            <th>Gambar</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="firmwares.length > 0">
          <tr v-for="(firmware, index) in this.firmwares" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ firmware.tipe }}</td>
            <td>{{ firmware.versi }}</td>
            <td>{{ firmware.android }}</td>
            <td>{{ firmware.flash }}</td>
            <td>{{ firmware.ota }}</td>
            <td>{{ firmware.kategori }}</td>
            <td>{{ firmware.gambar }}</td>
            <td class="d-flex gap-2">
              <a href="#">Edit</a>
              <a href="#">Hapus</a>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="3">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import AddFirmwares from '../../components/ModalFirmwares/AddFirmwares.vue'
import axios from 'axios'

export default {
  name: 'FirmwaresImin',
  components: {
    AddFirmwares,
  },
  data() {
    return {
      firmwares: [],
    }
  },
  created() {
    this.getFirmwares()
  },
  methods: {
    getFirmwares() {
      axios
        .get('getfirmwares')
        .then((response) => {
          this.firmwares = response.data.data
          console.log(this.firmwares)
        })
        .catch((error) => {
          console.error('Gagal mendapatkan data', error)
        })
    },
  },
}
</script>
