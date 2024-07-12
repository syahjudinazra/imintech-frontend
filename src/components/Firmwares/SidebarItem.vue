<template>
  <div class="sidebar">
    <li v-for="item in navigationItems" :key="item.text">
      <router-link
        :to="item.path"
        class="navigation-item text-dark text-decoration-none"
        active-class="active-navigation-item"
        >{{ item.text }}</router-link
      >
    </li>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navigationItems = ref([
  { text: 'M2-202', path: '/firmwares/information/m2-202' },
  { text: 'M2-203', path: '/m2-203' },
  { text: 'M2 Pro', path: '/m2-pro' },
  { text: 'M2 Max', path: '/m2-max' },
  { text: 'Swift 1', path: '/swift-1' },
  { text: 'Swift 1 Pro', path: '/swift-1-pro' },
  { text: 'Swift 2', path: '/swift-2' },
  { text: 'Swift 2 Pro', path: '/swift-2-pro' },
  { text: 'D1', path: '/d1' },
  { text: 'D1 Pro', path: '/d1-pro' },
  { text: 'Falcon 1', path: '/falcon-1' },
  { text: 'D2', path: '/d2' },
  { text: 'D3', path: '/d3' },
  { text: 'D4', path: '/d4' },
  { text: 'D4 Pro', path: '/d4-pro' },
  { text: 'Swan 1', path: '/swan-1' },
  { text: 'Swan 1 Pro', path: '/swan-1-pro' },
  { text: 'Crane 1', path: '/crane-1' },
  { text: 'S1', path: '/S1' },
  { text: 'K1', path: '/K1' },
])
</script>

<style scoped>
li {
  list-style-type: none;
}

.sidebar {
  width: 150px;
  background-color: #f0f0f0;
  overflow-y: auto;
  height: 400px;
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
