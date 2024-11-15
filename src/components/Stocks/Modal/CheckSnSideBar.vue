<template>
  <div class="tab-results">
    <!-- Sidebar Transition -->
    <Transition enter-active-class="animate-slide-in" leave-active-class="animate-slide-out">
      <div v-if="isVisible" class="sidebar">
        <!-- Header -->
        <div class="sidebar-header">
          <h6 class="m-0">Query results</h6>
          <button @click="onClose" class="btn-close"></button>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-item"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }} ({{ getResultCount(tab.id) }})
          </div>
        </div>

        <!-- Results Table -->
        <div class="results-table">
          <div class="table-header">
            <div class="col-sn">SN</div>
            <div class="col-state">State</div>
          </div>

          <div class="table-body">
            <template v-if="filteredResults.length">
              <div v-for="(result, index) in filteredResults" :key="index" class="table-row">
                <div class="col-sn" :class="{ 'duplicate-sn': isDuplicate(result.serialNumber) }">
                  {{ result.serialNumber }}
                </div>
                <div
                  class="col-state"
                  :class="{
                    'text-success': result.found,
                    'text-danger': !result.found,
                  }"
                >
                  {{ result.found ? 'Success' : 'Failure' }}
                </div>
              </div>
            </template>
            <div v-else class="no-results">No {{ activeTab }} results found</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  results: {
    type: Array,
    required: true,
  },
})

// Emits
const emit = defineEmits(['close'])

// State
const activeTab = ref('success')

// Constants
const tabs = [
  { id: 'success', label: 'Success' },
  { id: 'failure', label: 'Failure' },
  { id: 'duplicates', label: 'Duplicates' },
]

// Computed
const successResults = computed(() => props.results.filter((result) => result.found))

const failureResults = computed(() => props.results.filter((result) => !result.found))

// Get counts of serial numbers to identify duplicates
const serialNumberCounts = computed(() => {
  const counts = {}
  props.results.forEach((result) => {
    counts[result.serialNumber] = (counts[result.serialNumber] || 0) + 1
  })
  return counts
})

// Get duplicate results
const duplicateResults = computed(() => {
  const duplicateSerialNumbers = new Set(
    Object.entries(serialNumberCounts.value)
      .filter(([, count]) => count > 1)
      .map(([serialNumber]) => serialNumber),
  )
  return props.results.filter((result) => duplicateSerialNumbers.has(result.serialNumber))
})

const filteredResults = computed(() => {
  switch (activeTab.value) {
    case 'success':
      return successResults.value
    case 'failure':
      return failureResults.value
    case 'duplicates':
      return duplicateResults.value
    default:
      return []
  }
})

// Methods
const isDuplicate = (serialNumber) => {
  return serialNumberCounts.value[serialNumber] > 1
}

const getResultCount = (tabId) => {
  switch (tabId) {
    case 'success':
      return successResults.value.length
    case 'failure':
      return failureResults.value.length
    case 'duplicates':
      return duplicateResults.value.length
    default:
      return 0
  }
}

const onClose = () => {
  emit('close')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 350px;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  overflow-x: hidden;
}

.sidebar-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.tab-item {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #6c757d;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-item:hover {
  color: #dc3545;
}

.tab-item.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
}

.results-table {
  width: 100%;
  height: calc(100vh - 116px);
  overflow-y: auto;
}

.table-header {
  display: flex;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 500;
  font-size: 0.875rem;
  position: sticky;
  top: 0;
}

.table-body {
  overflow-y: auto;
}

.table-row {
  display: flex;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.col-sn {
  flex: 2;
}

.col-state {
  flex: 1;
}

.text-success {
  color: #198754;
}

.text-danger {
  color: #dc3545;
}

.duplicate-sn {
  color: #dc3545;
  font-weight: bold;
}

.no-results {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
  font-style: italic;
}

/* Animation classes */
.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-slide-out {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
