<template>
  <div>
    <ul>
      <li v-for="pinjam in pinjams.data" :key="pinjam.id">{{ pinjam.title }}</li>
    </ul>
    <button @click="fetchPinjams(pinjams.prev_page_url)" :disabled="!pinjams.prev_page_url">
      Previous
    </button>
    <button @click="fetchPinjams(pinjams.next_page_url)" :disabled="!pinjams.next_page_url">
      Next
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const pinjams = ref([])
const currentPage = ref(1)

const fetchPinjams = async (pageUrl = null) => {
  const url = pageUrl ? pageUrl : `getpinjam?page=${currentPage.value}`
  const response = await axios.get(url)
  pinjams.value = response.data.data
  currentPage.value = response.data.current_page
}

onMounted(() => {
  fetchPinjams()
})
</script>
