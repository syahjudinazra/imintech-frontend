<template>
  <div class="container-fluid">
    <div class="Historyspareparts-title">
      <h2>History Spareparts</h2>
    </div>
    <div class="d-flex gap-2 align-items-center justify-content-end">
      <div class="div">
        <select v-model="searchField" class="form-select shadow-none" id="searchField">
          <option disabled value="">Cari berdasarkan kolom</option>
          <option value="causer.name">User</option>
          <option value="subject.nosparepart">No Sparepart</option>
          <option value="subject.tipe">Tipe</option>
        </select>
      </div>

      <br />

      <div class="search">
        <input
          v-model="searchValue"
          type="text"
          class="form-control shadow-none"
          id="search"
          placeholder="Cari..."
        />
      </div>
    </div>
    <div class="mt-2">
      <EasyDataTable
        :headers="headers"
        :items="filteredActivities"
        :search-field="searchField"
        :search-value="searchValue"
        :loading="loading"
        :theme-color="baseColor"
        :rows-per-page="3"
        table-class-name="head-table"
        alternating
        show-index
        border-cell
        buttons-pagination
      >
        <template #loading>
          <div class="loader"></div>
        </template>
        <template #empty-message>
          <p>Data tidak ditemukan</p>
        </template>
        <template #items="{ item }">
          <tr>
            <td>{{ item.causer.name }}</td>
            <td>{{ item.subject.nosparepart }}</td>
            <td>{{ item.subject.tipe }}</td>
            <td>{{ item.properties.old }}</td>
            <td>{{ item.properties.attributes }}</td>
            <td>{{ item.description }}</td>
            <td>{{ formatDate(item.created_at) }}</td>
          </tr>
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import moment from 'moment'

const activities = ref([])
const loading = ref(true)
const searchField = ref('')
const searchValue = ref('')
const token = localStorage.getItem('token')

// Constants
const baseColor = '#e55353'
const headers = ref([
  { text: 'User', value: 'causer.name' },
  { text: 'No Sparepart', value: 'subject.nosparepart' },
  { text: 'Tipe', value: 'subject.tipe' },
  { text: 'Before', value: 'properties.old' },
  { text: 'After', value: 'properties.attributes' },
  { text: 'Description', value: 'description' },
  { text: 'Created At', value: 'created_at' },
])

const fetchActivities = async () => {
  loading.value = true
  try {
    const response = await axios.get('getlogspareparts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    activities.value = response.data
  } catch (error) {
    console.error('Error fetching activity logs:', error)
  } finally {
    loading.value = false
  }
}

const filteredActivities = computed(() => {
  if (!searchField.value || !searchValue.value) {
    return activities.value
  }
  return activities.value.filter((activity) =>
    activity[searchField.value].toLowerCase().includes(searchValue.value.toLowerCase()),
  )
})

const formatDate = (date) => {
  // Convert to a moment object and format it
  return moment(date).tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss')
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.head-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
}
input:focus {
  border-color: #d22c36;
}

textarea:focus {
  border-color: #d22c36;
}
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 6px;
  background: conic-gradient(from 135deg at top, currentColor 90deg, #0000 0) 0 calc(50% - 4px) /
      17px 8.5px,
    radial-gradient(
        farthest-side at bottom left,
        #0000 calc(100% - 6px),
        currentColor calc(100% - 5px) 99%,
        #0000
      )
      top right/50% 50% content-box content-box,
    radial-gradient(
        farthest-side at top,
        #0000 calc(100% - 6px),
        currentColor calc(100% - 5px) 99%,
        #0000
      )
      bottom / 100% 50% content-box content-box;
  background-repeat: no-repeat;
  animation: l11 1s infinite linear;
}
@keyframes l11 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
