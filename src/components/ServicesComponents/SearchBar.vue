<template>
  <div class="mb-2 d-flex gap-1">
    <input
      v-model="searchQuery"
      type="text"
      class="form-control shadow-none"
      id="search"
      placeholder="Search..."
    />
    <button type="submit" @click="searchServices()" class="btn btn-danger text-white">
      Submit
    </button>

    <div v-if="services.length > 0">
      <ul>
        <li v-for="service in services" :key="service.id">{{ service.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const searchQuery = ref(null)
const services = ref([])

const searchServices = async () => {
  try {
    const response = await axios.get('search', {
      params: { query: searchQuery.value },
    })
    services.value = response.data.data
  } catch (error) {
    console.error('Error fetching services:', error)
  }
}

onMounted(searchServices) // Call searchServices on component mount

// Alternative (call searchServices whenever searchQuery changes)
// watch(searchQuery, searchServices)  // This approach is not recommended in Vue 3
</script>
