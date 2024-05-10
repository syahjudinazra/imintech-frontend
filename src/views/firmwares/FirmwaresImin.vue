<template>
  <CContainer fluid>
    <div class="firmwares-title">
      <h2>Firmwares</h2>
    </div>
    <CRow :xs="{ cols: 1, gutter: 4 }" :md="{ cols: 3 }">
      <CCol xs>
        <CCard v-for="firmware in firmwares" :key="firmware.id">
          <CCardImage orientation="top" :src="firmware.gambar" />
          <CCardBody>
            <CCardTitle class="bg-danger text-center text-white rounded-pill">{{
              firmware.tipe
            }}</CCardTitle>
            <CCardText>Firmware: {{ firmware.versi }}</CCardText>
            <CCardText>Android: {{ firmware.android }}</CCardText>
            <CCardText>Flash: {{ firmware.flash }}</CCardText>
            <CCardText>OTA: {{ firmware.ota }}</CCardText>
          </CCardBody>
          <CCardFooter
            ><small class="text-body-secondary">Last updated 3 mins ago</small></CCardFooter
          >
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const firmwares = ref([])

function getFirmwares() {
  axios
    .get('getfirmwares')
    .then((response) => {
      firmwares.value = response.data.data
    })
    .catch((error) => {
      console.error('Failed to fetch data', error)
    })
}

getFirmwares()
</script>
