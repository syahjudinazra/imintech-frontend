<template>
  <CContainer fluid>
    <div class="firmwares-title">
      <h2>Firmwares</h2>
    </div>

    <div class="d-flex">
      <SidebarItem />
      <div class="sidebar-content">
        <router-view />
      </div>
    </div>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import SidebarItem from '../../components/Firmwares/SidebarItem.vue'

const firmwares = ref([])

async function fetchFirmwares() {
  try {
    const response = await axios.get(`getfirmwares`)
    firmwares.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

onMounted(() => {
  fetchFirmwares()
})
</script>

<style scoped>
.firmwares-title {
  margin-bottom: 20px;
}

.sidebar-content {
  flex-grow: 1;
  padding: 20px;
}
</style>
