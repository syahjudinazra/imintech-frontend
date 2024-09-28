<template>
  <div class="search-android position-relative">
    <input
      type="text"
      v-model="searchTerm"
      @input="debounceSearch"
      placeholder="Search android..."
      class="form-control shadow-none pr-4"
    />
    <button
      v-if="searchTerm"
      @click="resetSearch"
      class="close-search btn btn-link position-absolute end-0 top-50 translate-middle-y text-black"
      style="right: 10px"
    >
      <p class="fw-bold">X</p>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  onSearch: {
    type: Function,
    required: true,
  },
})

const searchTerm = ref('')
let debounceTimeout

const debounceSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    props.onSearch(searchTerm.value.trim())
  }, 300)
}

const resetSearch = () => {
  searchTerm.value = ''
  props.onSearch('')
}

// Clear the timeout when the component is unmounted
watch(() => {
  return () => clearTimeout(debounceTimeout)
})
</script>

<style scoped>
.search-technician {
  width: 300px;
}

.form-control:focus {
  border-color: #e55353;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);
}

.close-search {
  margin-top: 0.5rem;
  text-decoration: none;
}
</style>
