<template>
  <CContainer fluid>
    <div class="firmwares-title">
      <h2>Firmwares</h2>
    </div>

    <div class="d-flex">
      <div id="firmwares-sidebar" class="sidebar">
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Add Firmware</a></li>
          <li><a href="#">Manage Firmwares</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </div>
      <div id="firmwares-content" class="content">
        <!-- Your main content here -->
      </div>
    </div>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

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

#firmwares-sidebar {
  width: 250px;
  background-color: #f8f9fa;
  padding: 15px;
  border-right: 1px solid #dee2e6;
}

#firmwares-sidebar ul {
  list-style: none;
  padding: 0;
}

#firmwares-sidebar ul li {
  margin: 10px 0;
}

#firmwares-sidebar ul li a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

#firmwares-sidebar ul li a:hover {
  text-decoration: underline;
}

#firmwares-content {
  flex: 1;
  padding: 15px;
}
</style>
