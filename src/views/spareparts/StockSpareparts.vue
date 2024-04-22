<template>
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
        <tr>
          <td>1</td>
          <td>347583</td>
          <td>D3</td>
          <td>Test</td>
          <td>789</td>
          <td>90000</td>
          <td>Edit</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AddDataSpareparts from '../../components/ModalSpareparts/AddDataSpareparts.vue'

export default {
  components: {
    AddDataSpareparts,
  },
}
</script>
