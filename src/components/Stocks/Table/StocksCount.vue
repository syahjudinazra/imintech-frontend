<template>
  <div class="mt-2">
    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="processedStocks"
      :loading="loading"
      :theme-color="baseColor"
      :rows-per-page="10"
      table-class-name="customize-table"
      alternating
      border-cell
      buttons-pagination
    >
      <template #loading>
        <div class="loader"></div>
      </template>
      <template #empty-message>
        <p>Data not found</p>
      </template>
      <template #item="{ item }">
        <tr>
          <td>{{ item.type }}</td>
          <td class="text-center">{{ item.warehouse }}</td>
          <td class="text-center">{{ item.services }}</td>
          <td class="text-center">{{ item.loan }}</td>
          <td class="text-center">{{ item.sold }}</td>
          <td class="text-center">{{ item.damage }}</td>
          <td class="text-center">{{ item.entrust }}</td>
          <td class="text-center fw-bold">{{ item.total }}</td>
        </tr>
      </template>
    </EasyDataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

const stocks = ref([])
const loading = ref(true)
const baseColor = '#e55353'

// Define headers for the table
const headers = ref([
  { text: 'Devices', value: 'type' },
  { text: 'Warehouse', value: 'warehouse' },
  { text: 'Services', value: 'services' },
  { text: 'Loan', value: 'loan' },
  { text: 'Sold', value: 'sold' },
  { text: 'Damage', value: 'damage' },
  { text: 'Entrust', value: 'entrust' },
  { text: 'Total', value: 'total' },
])

const serverItemsLength = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'type',
  sortType: 'asc',
  search: '',
})

// Process stocks data for display
const processedStocks = computed(() => {
  const countsByType = {}

  stocks.value.forEach((stock) => {
    const type = stock.type || stock.stocks_devices_id // Adjust based on your API response
    const status = stock.status

    if (!countsByType[type]) {
      countsByType[type] = {
        type,
        warehouse: 0,
        services: 0,
        loan: 0,
        sold: 0,
        damage: 0,
        entrust: 0,
      }
    }

    // Increment the appropriate status count
    switch (status) {
      case 'Warehouse':
        countsByType[type].warehouse++
        break
      case 'Services':
        countsByType[type].services++
        break
      case 'Loan':
        countsByType[type].loan++
        break
      case 'Sold':
        countsByType[type].sold++
        break
      case 'Damage':
        countsByType[type].damage++
        break
      case 'Entrust':
        countsByType[type].entrust++
        break
    }
  })

  // Calculate totals and convert to array
  return Object.values(countsByType).map((item) => ({
    ...item,
    total: item.warehouse + item.services + item.loan + item.sold + item.damage + item.entrust,
  }))
})

// Fetch data from API
const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('stocks', {
      params: {
        page: serverOptions.value.page,
        per_page: serverOptions.value.rowsPerPage,
        sort_by: serverOptions.value.sortBy,
        sort_type: serverOptions.value.sortType,
        search: serverOptions.value.search,
      },
    })
    stocks.value = response.data.data
    serverItemsLength.value = processedStocks.value.length
  } catch (error) {
    console.error('Error fetching stocks:', error)
  } finally {
    loading.value = false
  }
}

// Watch for changes in server options
watch(
  serverOptions,
  () => {
    fetchData()
  },
  { deep: true },
)

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;
  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
}

.text-center {
  text-align: center;
}

.fw-bold {
  font-weight: bold;
}

/* Loader animation */
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
