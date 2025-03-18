<!-- ProcessNavigation.vue -->
<template>
  <nav class="w-full d-flex">
    <div
      v-for="(item, index) in menuItems"
      :key="index"
      class="step-item"
      :class="[
        isCurrentRoute(item.path) ? 'active' : '',
        index === 0 ? 'first' : '',
        index === menuItems.length - 1 ? 'last' : '',
      ]"
    >
      <router-link
        :to="item.path"
        class="step-link"
        :class="[isCurrentRoute(item.path) ? 'text-white' : 'text-white']"
      >
        {{ formatName(item.name) }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = ref([
  {
    path: '/services/incoming-stocks',
    name: 'Incoming',
  },
  {
    path: '/services/queue-stocks',
    name: 'Queue',
  },
  {
    path: '/services/pending-stocks',
    name: 'Pending',
  },
  {
    path: '/services/validation-stocks',
    name: 'Validation',
  },
  {
    path: '/services/delivery-stocks',
    name: 'Delivery',
  },
  {
    path: '/services/done-stocks',
    name: 'Done',
  },
])

const isCurrentRoute = (path) => {
  return route.path === path
}

const formatName = (name) => {
  if (!name) return ''
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
</script>

<style scoped>
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  padding: 1rem 0;
}

.step-item {
  position: relative;
  background: #fc757e;
  height: 40px;
  display: flex;
  align-items: center;
  margin-right: 20px;
  padding: 0 25px 0 35px;
  clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);
  opacity: 0.7;
  transition: all 0.3s ease;
}

.step-item.active {
  background: #f6323f;
  opacity: 1;
}

.step-link {
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
  padding: 0 5px;
  z-index: 2;
}

/* First item has different clip-path */
.step-item.first {
  clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%);
  padding-left: 25px;
}

/* Hover effect */
.step-item:hover {
  opacity: 0.9;
}

.step-item.active:hover {
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 10px;
  }

  .step-item {
    width: 80%;
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
