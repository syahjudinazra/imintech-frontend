<template>
  <CContainer fluid>
    <div class="firmwares-title">
      <h2>Firmwares</h2>
    </div>

    <!-- Tabs -->
    <CNav variant="tabs" role="tablist" class="mb-2">
      <CNavItem @click="changeTab(1)">
        <CNavLink :active="tabPanePillsActiveKey === 1">Desktop</CNavLink>
      </CNavItem>
      <CNavItem @click="changeTab(2)">
        <CNavLink :active="tabPanePillsActiveKey === 2">Mobile</CNavLink>
      </CNavItem>
      <CNavItem @click="changeTab(3)">
        <CNavLink :active="tabPanePillsActiveKey === 3">KIOSK</CNavLink>
      </CNavItem>
    </CNav>
    <CTabContent>
      <!-- Desktop Tab Pane -->
      <CTabPane role="tabpanel" :visible="tabPanePillsActiveKey === 1">
        <CRow :xs="{ cols: 1, gutter: 3 }" :sm="{ cols: 2 }" :md="{ cols: 3 }" :lg="{ cols: 4 }">
          <CCol
            v-for="firmware in filteredFirmwares('Desktop')"
            :key="firmware.id"
            class="d-flex gap-4"
          >
            <CCard>
              <CCardImage orientation="top" :src="firmware.gambar" alt="Firmware Image" />
              <CCardBody>
                <CCardTitle class="bg-danger text-center text-white rounded-pill">
                  {{ firmware.tipe }}
                </CCardTitle>
                <CCardText>Firmware: {{ firmware.versi }}</CCardText>
                <CCardText>Android: {{ firmware.android }}</CCardText>
                <div class="d-flex align-items-center gap-2">
                  <CCardText>Flash: </CCardText>
                  <CButton
                    as="a"
                    :href="firmware.flash"
                    class="text-white mb-2"
                    size="sm"
                    color="info"
                  >
                    Download
                  </CButton>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <CCardText>OTA: </CCardText>
                  <CButton
                    as="a"
                    :href="firmware.ota"
                    class="text-white mb-2"
                    size="sm"
                    color="info"
                  >
                    Download
                  </CButton>
                </div>
              </CCardBody>
              <CCardFooter>
                <small class="text-body-secondary">Last updated 3 mins ago</small>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CTabPane>

      <!-- Mobile Tab Pane -->
      <CTabPane role="tabpanel" :visible="tabPanePillsActiveKey === 2">
        <CRow :xs="{ cols: 1, gutter: 3 }" :sm="{ cols: 2 }" :md="{ cols: 3 }" :lg="{ cols: 4 }">
          <CCol
            v-for="firmware in filteredFirmwares('Mobile')"
            :key="firmware.id"
            class="d-flex gap-4"
          >
            <CCard>
              <CCardImage orientation="top" :src="firmware.gambar" alt="Firmware Image" />
              <CCardBody>
                <CCardTitle class="bg-danger text-center text-white rounded-pill">
                  {{ firmware.tipe }}
                </CCardTitle>
                <CCardText>Firmware: {{ firmware.versi }}</CCardText>
                <CCardText>Android: {{ firmware.android }}</CCardText>
                <div class="d-flex align-items-center gap-2">
                  <CCardText>Flash: </CCardText>
                  <CButton
                    as="a"
                    :href="firmware.flash"
                    class="text-white mb-2"
                    size="sm"
                    color="info"
                  >
                    Download
                  </CButton>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <CCardText>OTA: </CCardText>
                  <CButton
                    as="a"
                    :href="firmware.ota"
                    class="text-white mb-2"
                    size="sm"
                    color="info"
                  >
                    Download
                  </CButton>
                </div>
              </CCardBody>
              <CCardFooter>
                <small class="text-body-secondary">Last updated 3 mins ago</small>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CTabPane>

      <!-- KIOSK Tab Pane -->
      <CTabPane role="tabpanel" :visible="tabPanePillsActiveKey === 3">
        <CRow :xs="{ cols: 1, gutter: 3 }" :sm="{ cols: 2 }" :md="{ cols: 3 }" :lg="{ cols: 4 }">
          <CCol
            v-for="firmware in filteredFirmwares('KIOSK')"
            :key="firmware.id"
            class="d-flex gap-4"
          >
            <CCard>
              <CCardImage orientation="top" :src="firmware.gambar" alt="Firmware Image" />
              <CCardBody>
                <CCardTitle class="bg-danger text-center text-white rounded-pill">
                  {{ firmware.tipe }}
                </CCardTitle>
                <CCardText>Firmware: {{ firmware.versi }}</CCardText>
                <CCardText>Android: {{ firmware.android }}</CCardText>
                <div class="d-flex align-items-center gap-2">
                  <CCardText>Flash: </CCardText>
                  <CButton
                    as="a"
                    :href="firmware.flash"
                    class="text-white mb-2"
                    size="sm"
                    color="info"
                  >
                    Download
                  </CButton>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <CCardText>OTA: </CCardText>
                  <CButton
                    as="a"
                    :href="firmware.ota"
                    class="text-white mb-2"
                    size="sm"
                    color="info"
                  >
                    Download
                  </CButton>
                </div>
              </CCardBody>
              <CCardFooter>
                <small class="text-body-secondary">Last updated 3 mins ago</small>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CTabPane>
    </CTabContent>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const firmwares = ref([])
const tabPanePillsActiveKey = ref(1)

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

const filteredFirmwares = (category) => {
  return firmwares.value.filter((firmware) => firmware.kategori === category)
}

const changeTab = (key) => {
  tabPanePillsActiveKey.value = key
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
