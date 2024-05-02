<template>
  <div class="container">
    <AddStocksDevices />
    <div class="table-responsive">
      <table class="table caption-top">
        <caption class="fw-bold">
          List of Stocks Device
        </caption>
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="stocksdevices.length > 0">
          <tr v-for="(stocksdevice, index) in this.stocksdevices" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ stocksdevice.name }}</td>
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
import AddStocksDevices from '../../components/ModalStocksDevices/AddStocksDevices.vue'
import axios from 'axios'

export default {
  components: {
    AddStocksDevices,
  },
  data() {
    return {
      stocksdevices: [],
    }
  },
  created() {
    this.getDevicesStocks()
  },
  methods: {
    getDevicesStocks() {
      axios
        .get('getliststocks')
        .then((response) => {
          this.stocksdevices = response.data.data
        })
        .catch((error) => {
          console.error('Gagal mendapatkan data', error)
        })
    },
  },
}
</script>
