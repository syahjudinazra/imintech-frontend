<template>
  <div class="search position-relative">
    <input
      type="text"
      v-model="searchTerm"
      @input="debounceSearch"
      placeholder="Search..."
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
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  onSearch: {
    type: Function,
    required: true,
  },
})

const searchTerm = ref('')
let debounceTimeout = null

const debounceSearch = () => {
  clearTimeout(debounceTimeout)
  console.log('Input detected, search term:', searchTerm.value)

  debounceTimeout = setTimeout(() => {
    const trimmedTerm = searchTerm.value.trim()
    console.log('Debounce complete, calling onSearch with:', trimmedTerm)
    props.onSearch(trimmedTerm)
  }, 300)
}

const resetSearch = () => {
  searchTerm.value = ''
  console.log('Search reset, calling onSearch with empty string')
  props.onSearch('')
}

onUnmounted(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
})
</script>

<style scoped>
.search {
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
