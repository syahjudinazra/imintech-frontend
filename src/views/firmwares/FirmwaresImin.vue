<template>
  <CContainer fluid>
    <div class="firmwares-title">
      <h2>Firmwares</h2>
    </div>
    <CRow :xs="{ cols: 1, gutter: 3 }" :sm="{ cols: 2 }" :md="{ cols: 3 }" :lg="{ cols: 4 }">
      <CCol v-for="firmware in firmwares" :key="firmware.id" class="d-flex gap-4">
        <CCard>
          <CCardImage orientation="top" :src="firmware.gambar" alt="Firmware Image" />
          <CCardBody>
            <CCardTitle class="bg-danger text-center text-white rounded-pill">
              {{ firmware.tipe }}
            </CCardTitle>
            <CCardText>Firmware: {{ firmware.versi }}</CCardText>
            <CCardText>Android: {{ firmware.android }}</CCardText>
            <CCardText>Flash: {{ firmware.flash }}</CCardText>
            <CCardText>OTA: {{ firmware.ota }}</CCardText>
          </CCardBody>
          <CCardFooter>
            <small class="text-body-secondary">Last updated 3 mins ago</small>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const firmwares = ref([])

const getFirmwares = () => {
  axios
    .get('getfirmwares')
    .then((response) => {
      firmwares.value = response.data.data
    })
    .catch((error) => {
      console.error('Failed to fetch data', error)
    })
}

onMounted(() => {
  getFirmwares()
})
</script>
<style scoped>
.firmwares-title {
  margin-bottom: 20px;
  text-align: center;
}

.CCard {
  margin: 20px 0;
}

.CCardImage {
  object-fit: cover;
  height: 200px;
}
</style>
