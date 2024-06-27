<template>
  <div class="container-fluid">
    <AddDataSpareparts />
    <div class="d-flex align-items-end justify-content-between">
      <caption class="fw-bold">
        List of Data History Spareparts
      </caption>
      <div class="input-group mb-2 w-auto">
        <input
          type="text"
          class="form-control shadow-none"
          placeholder="Search..."
          aria-label="Search..."
          aria-describedby="search"
          v-model="searchQuery"
        />
        <button
          @click="searchSpareparts"
          class="btn btn-outline-danger shadow-none"
          type="button"
          id="search"
        >
          Submit
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table caption-top">
        <thead class="table-dark">
          <tr>
            <th>User</th>
            <th>No Spareparts</th>
            <th>Tipe</th>
            <th>Before</th>
            <th>After</th>
            <th>Description</th>
            <th>Date Changes</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td colspan="7" class="text-center">
              <div class="d-flex justify-content-center align-items-center">
                <div class="loader"></div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="activities.length > 0">
          <tr v-for="activity in activities" :key="activity.id">
            <td>{{ activity.causer }}</td>
            <td>{{ activity.subject.nosparepart }}</td>
            <td>{{ activity.subject.tipe }}</td>
            <td>{{ activity.properties.old }}</td>
            <td>{{ activity.properties.attributes }}</td>
            <td>{{ activity.description }}</td>
            <td>{{ formatDate(activity.created_at) }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const activities = ref([])
const loading = ref(true)
const searchQuery = ref('')
const token = localStorage.getItem('token')

const fetchActivities = async (query = '') => {
  loading.value = true
  try {
    const response = await axios.get('getlogspareparts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { search: query },
    })
    activities.value = response.data
  } catch (error) {
    console.error('Error fetching activity logs:', error)
  } finally {
    loading.value = false
  }
}

const searchSpareparts = () => {
  fetchActivities(searchQuery.value)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.loader {
  width: 30px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #000;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
