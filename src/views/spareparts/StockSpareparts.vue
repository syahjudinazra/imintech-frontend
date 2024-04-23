<template>
  <div>
    <AddDataSpareparts />

    <div class="table-responsive">
      <table class="table caption-top">
        <caption class="fw-bold">
          List of Spareparts
        </caption>
        <thead>
          <tr>
            <th>No</th>
            <th>No Spareparts</th>
            <th>Tipe</th>
            <th>Nama</th>
            <th>Quantity</th>
            <th>Harga</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sparepart, index) in spareparts" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ sparepart.nospareparts }}</td>
            <td>{{ sparepart.sparepartsdevice_id }}</td>
            <td>{{ sparepart.nama }}</td>
            <td>{{ sparepart.quantity }}</td>
            <td>{{ sparepart.harga }}</td>
            <td><a href="#">View</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import AddDataSpareparts from '../../components/ModalSpareparts/AddDataSpareparts.vue'
import axios from 'axios'

export default {
  components: {
    AddDataSpareparts,
  },
  data() {
    return {
      nospareparts: '',
      sparepartsdevice_id: '',
      nama: '',
      quantity: '',
      harga: '',
      spareparts: [],
    }
  },
  methods: {
    async getDataSpareparts() {
      try {
        const response = await axios.get('getspareparts')
        console.log(response.data)
        this.spareparts = response.data
      } catch (error) {
        console.error('fetch data failed:', error)
      }
    },
  },
  mounted() {
    this.getDataSpareparts()
  },
}
</script>
