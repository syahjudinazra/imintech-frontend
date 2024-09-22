<template>
  <div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search customers..."
      class="search-input"
    />

    <ul v-if="customers.length">
      <li v-for="customer in customers" :key="customer.id">
        {{ customer.name }} - {{ customer.phone }} - {{ customer.address }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash-es'

// State variables
const searchQuery = ref('')
const customers = ref([])

// Debounced function to search customers
const searchCustomers = debounce(async () => {
  try {
    const response = await axios.get('customers', {
      params: { search: searchQuery.value },
    })
    customers.value = response.data.customers
  } catch (error) {
    console.error('Error fetching customers:', error)
  }
}, 300) // Wait for 300ms before triggering the search request

// Watch for changes in searchQuery and call the search function
watch(searchQuery, () => {
  searchCustomers()
})
</script>

<style>
.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
