<!-- ProcessNavigation.vue -->
<template>
  <div class="stepper-wrapper">
    <div
      v-for="(item, index) in menuItems"
      :key="item.name"
      class="step-item"
      :class="[
        isCurrentRoute(item.path) ? 'active' : '',
        index === 0 ? 'first' : '',
        index === menuItems.length - 1 ? 'last' : '',
        `z-index-${menuItems.length - index}`,
      ]"
    >
      <div class="step-number">{{ index + 1 }}</div>
      <router-link
        :to="item.path"
        class="step-link"
        :class="[isCurrentRoute(item.path) ? 'text-white' : '']"
        v-slot="{ navigate }"
        custom
      >
        <span @click="navigate" class="step-text">{{ formatName(item.name) }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

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

const activeIndex = computed(() => {
  return menuItems.value.findIndex((item) => isCurrentRoute(item.path))
})

// More reliable route checking
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

onMounted(() => {})

watch(
  () => route.path,
  (newPath) => {
    // You could add transition animations here if needed
  },
)
</script>

<style scoped>
.stepper-wrapper {
  display: flex;
  width: 100%;
  position: relative;
}

.step-item {
  position: relative;
  background-color: #fc757e;
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 14px;
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
  padding: 0 25px 0 35px;
  margin-right: -20px;
  transition: background-color 0.3s ease;
}

/* Explicitly set z-index values for each step */
.z-index-1 {
  z-index: 1;
}
.z-index-2 {
  z-index: 2;
}
.z-index-3 {
  z-index: 3;
}
.z-index-4 {
  z-index: 4;
}
.z-index-5 {
  z-index: 5;
}
.z-index-6 {
  z-index: 6;
}

.step-number {
  background-color: #fff;
  color: #111;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
  flex-shrink: 0;
  transition: background-color 0.3s ease;
}

.step-item.active .step-number {
  background-color: #fff;
}

.step-item.first {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
  padding-left: 20px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.step-item.last {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%);
  margin-right: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.step-item.active {
  background-color: #f6323f;
  color: white;
}

.step-link {
  text-decoration: none;
  color: white;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
  width: 100%;
  display: block;
}

.step-text {
  cursor: pointer;
  display: block;
  width: 100%;
}

.step-link.text-white {
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stepper-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .step-item {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
    clip-path: none;
    border-radius: 4px;
    padding: 0 15px;
  }

  .step-item.first,
  .step-item.last {
    clip-path: none;
    padding-left: 15px;
  }
}
</style>
