<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Activity Log</h4>
      <div class="d-flex gap-2">
        <Search @search="handleSearch" />
      </div>
    </div>

    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      @update:options="updateServerOptions"
      :headers="headers"
      :items="activityLogs"
      :loading="loading"
      :theme-color="baseColor"
      :rows-per-page="10"
      table-class-name="customize-table"
      alternating
      show-index
      border-cell
      buttons-pagination
    >
      <template #loading>
        <div class="loader"></div>
      </template>
      <template #empty-message>
        <p>No activity logs found</p>
      </template>
      <template #item-created_at="{ created_at }">
        {{ formatDate(created_at) }}
      </template>
      <template #item-causer="{ causer }">
        {{ causer?.name || 'System' }}
      </template>
      <template #item-properties="{ properties }">
        <div class="text-truncate" @click="showPropertiesModal(properties)">
          {{ formatProperties(properties) }}
        </div>
      </template>
    </EasyDataTable>

    <!-- Properties Modal -->
    <modal v-if="selectedProperties" @close="selectedProperties = null">
      <template #header>
        <h5>Activity Properties</h5>
      </template>
      <template #body>
        <pre>{{ JSON.stringify(selectedProperties, null, 2) }}</pre>
      </template>
    </modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Search from '../../components/Layouts/SearchAll'
import { debounce } from 'lodash'

// Reactive state
const activityLogs = ref([])
const loading = ref(true)
const selectedProperties = ref(null)

// Constants
const token = localStorage.getItem('token')
const baseColor = '#e55353'
const headers = ref([
  { text: 'Causer', value: 'causer_name' },
  { text: 'Serial Number', value: 'subject_details.serial_number' },
  { text: 'Device', value: 'subject_details.services_device' },
  { text: 'Before', value: 'changes.old' },
  { text: 'After', value: 'changes.attributes' },
  { text: 'Description', value: 'description' },
  { text: 'Date', value: 'created_at' },
])

// Pagination and filtering
const serverItemsLength = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
})

// Debounced search function
const debouncedSearch = debounce(() => {
  loadActivityLogs()
}, 300)

// Watch for changes in search term
watch(
  () => serverOptions.value.search,
  () => {
    debouncedSearch()
  },
)

const loadActivityLogs = async () => {
  loading.value = true
  try {
    const response = await axios.get('services-activity', {
      params: {
        page: serverOptions.value.page,
        per_page: serverOptions.value.rowsPerPage,
        sort_by: serverOptions.value.sortBy,
        sort_type: serverOptions.value.sortType,
        search: serverOptions.value.search,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    activityLogs.value = response.data.data
    serverItemsLength.value = response.data.total
  } catch (error) {
    console.error('Error loading activity logs:', error)
  } finally {
    loading.value = false
  }
}

// Update server options when table settings change
const updateServerOptions = (options) => {
  serverOptions.value = {
    ...serverOptions.value,
    ...options,
  }
  loadActivityLogs()
}

// Handle search input
const handleSearch = (term) => {
  serverOptions.value.page = 1 // Reset to first page
  serverOptions.value.search = term
  // Debounced search will be triggered by the watcher
}

// Format date for display
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// Format properties for display
const formatProperties = (properties) => {
  if (!properties) return ''

  const changes = []
  if (properties.changed_fields) {
    properties.changed_fields.forEach((field) => {
      changes.push(`${field.field}: ${field.from} → ${field.to}`)
    })
  }
  return changes.join(', ')
}

// Show properties modal
const showPropertiesModal = (properties) => {
  selectedProperties.value = properties
}

// Initial loads
onMounted(() => {
  loadActivityLogs()
})

// Watch for changes in server options
watch(
  () => serverOptions.value,
  () => loadActivityLogs(),
  { deep: true },
)
</script>

<style scoped>
/* Styles remain the same as in previous version */
.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;
  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
}

pre {
  max-height: 400px;
  overflow-y: auto;
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
}
</style>
<style scoped>
.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;
  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
}

pre {
  max-height: 400px;
  overflow-y: auto;
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
}

.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 6px;
  background: conic-gradient(from 135deg at top, currentColor 90deg, #0000 0) 0 calc(50% - 4px) /
      17px 8.5px,
    radial-gradient(
        farthest-side at bottom left,
        #0000 calc(100% - 6px),
        currentColor calc(100% - 5px) 99%,
        #0000
      )
      top right/50% 50% content-box content-box,
    radial-gradient(
        farthest-side at top,
        #0000 calc(100% - 6px),
        currentColor calc(100% - 5px) 99%,
        #0000
      )
      bottom / 100% 50% content-box content-box;
  background-repeat: no-repeat;
  animation: l11 1s infinite linear;
}
@keyframes l11 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
