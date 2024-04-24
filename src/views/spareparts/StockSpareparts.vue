<template>
  <div class="container-fluid">
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
          <tr v-if="loading">
            <td colspan="7" class="text-center">Loading...</td>
          </tr>
          <tr v-else-if="!spareparts || spareparts.length === 0">
            <td colspan="7" class="text-center">No spare parts available.</td>
          </tr>
          <tr v-else v-for="sparepart in spareparts.data" :key="sparepart.id">
            <td>{{ sparepart.id }}</td>
            <td>{{ sparepart.nosparepart }}</td>
            <td>{{ sparepart.tipe }}</td>
            <td>{{ sparepart.nama }}</td>
            <td>{{ sparepart.quantity }}</td>
            <td>{{ sparepart.harga }}</td>
            <td class="d-flex gap-2">
              <ViewDataSpareparts />

              <div class="btn-group dropend">
                <a
                  class="dropdown-toggle text-decoration-none"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Lainya
                </a>
                <ul class="dropdown-menu">
                  <li><AddQuantitySpareparts /></li>
                  <li><ReduceQuantitySpareparts /></li>
                  <li><a class="dropdown-item" href="#">Ubah</a></li>
                  <li><a class="dropdown-item" href="#">Hapus</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import AddDataSpareparts from '../../components/ModalSpareparts/AddDataSpareparts.vue'
import ViewDataSpareparts from '../../components/ModalSpareparts/ViewDataSpareparts.vue'
import AddQuantitySpareparts from '../../components/ModalSpareparts/AddQuantitySpareparts.vue'
import ReduceQuantitySpareparts from '../../components/ModalSpareparts/ReduceQuantitySpareparts.vue'
import axios from 'axios'

export default {
  components: {
    AddDataSpareparts,
    ViewDataSpareparts,
    AddQuantitySpareparts,
    ReduceQuantitySpareparts,
  },
  data() {
    return {
      spareparts: [],
      loading: true,
    }
  },
  methods: {
    async getDataSpareparts() {
      try {
        const response = await axios.get('getspareparts')
        this.spareparts = response.data.data
      } catch (error) {
        console.error('fetch data failed:', error)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.getDataSpareparts()
  },
}
</script>
