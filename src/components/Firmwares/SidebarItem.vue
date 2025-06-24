<script setup>
import { ref, computed } from 'vue'

const navigationItems = ref([
  { text: 'M2-202', path: '/firmwares/list/m2-202' },
  { text: 'M2-203', path: '/firmwares/list/m2-203' },
  { text: 'M2 Pro', path: '/firmwares/list/m2-pro' },
  { text: 'M2 Max', path: '/firmwares/list/m2-max' },
  { text: 'Swift 1', path: '/firmwares/list/swift-1' },
  { text: 'Swift 1 Pro', path: '/firmwares/list/swift-1-pro' },
  { text: 'Swift 2', path: '/firmwares/list/swift-2' },
  { text: 'Swift 2 Pro', path: '/firmwares/list/swift-2-pro' },
  { text: 'Swift 2 Ultra', path: '/firmwares/list/swift-2-ultra' },
  { text: 'D1', path: '/firmwares/list/d1' },
  { text: 'D1 Pro', path: '/firmwares/list/d1-pro' },
  { text: 'Falcon 1', path: '/firmwares/list/falcon-1' },
  { text: 'Falcon 2', path: '/firmwares/list/falcon-2' },
  { text: 'Falcon 2 Max', path: '/firmwares/list/falcon-2-max' },
  { text: 'D2', path: '/firmwares/list/d2' },
  { text: 'D3', path: '/firmwares/list/d3' },
  { text: 'D4', path: '/firmwares/list/d4' },
  { text: 'D4 Pro', path: '/firmwares/list/d4-pro' },
  { text: 'Swan 1', path: '/firmwares/list/swan-1' },
  { text: 'Swan 1 Pro', path: '/firmwares/list/swan-1-pro' },
  { text: 'Swan 2', path: '/firmwares/list/swan-2' },
  { text: 'Crane 1', path: '/firmwares/list/crane-1' },
  { text: 'S1', path: '/firmwares/list/s1' },
  { text: 'K1', path: '/firmwares/list/k1' },
  { text: 'K2', path: '/firmwares/list/k2' },
])

const searchQuery = ref('')

const normalizeText = (text) => {
  return text.toLowerCase().replace(/[\s-]+/g, '')
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return navigationItems.value

  const normalizedQuery = normalizeText(searchQuery.value)

  return navigationItems.value.filter((item) => {
    const normalizedText = normalizeText(item.text)
    return normalizedText.includes(normalizedQuery)
  })
})
</script>

<template>
  <div class="sidebar">
    <div class="search-container mb-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search firmware..."
        class="form-control shadow-none"
      />
    </div>

    <ul class="list-unstyled">
      <li v-for="item in filteredItems" :key="item.text" class="mb-2">
        <router-link
          :to="item.path"
          class="navigation-item text-dark text-decoration-none"
          active-class="active-navigation-item"
        >
          {{ item.text }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
input:focus {
  border-color: #d22c36;
}

li {
  list-style-type: none;
}

.sidebar {
  width: 150px;
  background-color: #f0f0f0;
  overflow-y: auto;
  height: 600px;
}

.sidebar li {
  margin-bottom: 1rem;
}

.navigation-item {
  color: black;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: block;
}

.navigation-item:hover {
  background-color: red;
  border-radius: 5px;
  color: white !important;
}

.active-navigation-item {
  background-color: red;
  border-radius: 5px;
  color: white !important;
  font-weight: bold;
}

@media (max-width: 768px) {
  /* Mobile */
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100vw;
    height: 100vh;
    z-index: 10;
  }

  .sidebar.active {
    left: 0;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  /* Tablet */
  .sidebar {
    width: 200px;
  }
}

@media (min-width: 992px) and (max-width: 1200px) {
  /* Laptop */
}

@media (min-width: 1200px) {
  /* Desktop */
  .sidebar {
    width: 250px;
  }
}
</style>
