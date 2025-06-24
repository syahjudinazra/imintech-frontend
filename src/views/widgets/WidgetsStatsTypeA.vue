<script setup>
import { ref, onMounted, computed } from 'vue'
import { CRow, CCol, CWidgetStatsA, CSpinner, CAlert, CCard, CCardBody, CButton } from '@coreui/vue'
import { cilArrowTop, cilArrowBottom } from '@coreui/icons'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/vue-chartjs'

// Reactive data
const dashboardData = ref({})
const loading = ref(false)
const error = ref(null)
const chartType = ref('line')

// Chart refs
const widgetChartRef1 = ref(null)
const widgetChartRef2 = ref(null)
const combinedChartRef = ref(null)
const doughnutChartRef = ref(null)
const growthRateChartRef = ref(null)
const polarAreaChartRef = ref(null)

// Chart colors
const chartColors = {
  primary: '#321fdb',
  info: '#39f',
  warning: '#f9b115',
  danger: '#e55353',
  success: '#2eb85c',
}

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://127.0.0.1:8000/api/v1'
const token = localStorage.getItem('token') || ''

/**
 * Fetch dashboard data from Laravel API
 */
const fetchDashboardData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Check if response has content
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text()
      console.error('Non-JSON response:', responseText)
      throw new Error('Server returned non-JSON response')
    }

    // Get response text first to check if it's empty
    const responseText = await response.text()
    console.log('Raw response:', responseText)

    if (!responseText.trim()) {
      throw new Error('Empty response from server')
    }

    // Parse JSON
    let result
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text that failed to parse:', responseText)
      throw new Error('Invalid JSON response from server')
    }

    console.log('Parsed result:', result)

    if (result.success) {
      // Transform the data to include chart labels
      dashboardData.value = {
        ...result.data,
        chart_labels: generateMonthLabels(),
      }
      console.log('Dashboard data updated:', dashboardData.value)
    } else {
      throw new Error(result.message || 'API returned success: false')
    }
  } catch (err) {
    error.value = `Failed to load dashboard data: ${err.message}`
    console.error('Dashboard data fetch error:', err)

    // Set default empty data to prevent template errors
    dashboardData.value = {
      stocks: {
        total: 0,
        percentage_change: { formatted: '0%', direction: 'neutral' },
        chart_data: [],
      },
      loans: {
        total: 0,
        percentage_change: { formatted: '0%', direction: 'neutral' },
        chart_data: [],
      },
      services: {
        total: 0,
        percentage_change: { formatted: '0%', direction: 'neutral' },
        chart_data: [],
      },
      users: {
        total: 0,
        percentage_change: { formatted: '0%', direction: 'neutral' },
        chart_data: [],
      },
      chart_labels: [],
    }
  } finally {
    loading.value = false
  }
}

/**
 * Generate month labels for charts (last 7 months)
 */
const generateMonthLabels = () => {
  const months = []
  const currentDate = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    months.push(date.toLocaleDateString('en-US', { month: 'long' }))
  }

  return months
}

/**
 * Format numbers with K, M suffixes
 */
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Get arrow icon based on direction
 */
const getArrowIcon = (direction) => {
  switch (direction) {
    case 'up':
      return cilArrowTop
    case 'down':
      return cilArrowBottom
    default:
      return cilArrowTop // Default to up arrow for neutral
  }
}

/**
 * Get line chart options with dynamic min/max
 */
const getLineChartOptions = (minValue = 0, maxValue = 100) => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        min: minValue,
        max: maxValue,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }
}

/**
 * Get area chart options
 */
const getAreaChartOptions = () => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }
}

/**
 * Get bar chart options
 */
const getBarChartOptions = () => {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  }
}

/**
 * Refresh dashboard data
 */
const refreshData = () => {
  fetchDashboardData()
}

/**
 * Combined chart data for all categories
 */
const combinedChartData = computed(() => ({
  labels: dashboardData.value.chart_labels || [],
  datasets: [
    {
      label: 'Stocks',
      data: dashboardData.value.stocks?.chart_data || [],
      backgroundColor: chartType.value === 'bar' ? chartColors.primary + '20' : 'transparent',
      borderColor: chartColors.primary,
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Loans',
      data: dashboardData.value.loans?.chart_data || [],
      backgroundColor: chartType.value === 'bar' ? chartColors.info + '20' : 'transparent',
      borderColor: chartColors.info,
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Services',
      data: dashboardData.value.services?.chart_data || [],
      backgroundColor: chartType.value === 'bar' ? chartColors.warning + '20' : 'transparent',
      borderColor: chartColors.warning,
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Users',
      data: dashboardData.value.users?.chart_data || [],
      backgroundColor: chartType.value === 'bar' ? chartColors.danger + '20' : 'transparent',
      borderColor: chartColors.danger,
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
  ],
}))

/**
 * Combined chart options
 */
const combinedChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#fff',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#8e8e93',
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(142, 142, 147, 0.1)',
      },
      ticks: {
        color: '#8e8e93',
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
}))

/**
 * Doughnut chart data for current totals
 */
const doughnutChartData = computed(() => ({
  labels: ['Stocks', 'Loans', 'Services', 'Users'],
  datasets: [
    {
      data: [
        dashboardData.value.stocks?.total || 0,
        dashboardData.value.loans?.total || 0,
        dashboardData.value.services?.total || 0,
        dashboardData.value.users?.total || 0,
      ],
      backgroundColor: [
        chartColors.primary,
        chartColors.info,
        chartColors.warning,
        chartColors.danger,
      ],
      borderWidth: 0,
      cutout: '70%',
    },
  ],
}))

/**
 * Doughnut chart options
 */
const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = formatNumber(context.parsed)
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((context.parsed / total) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        },
      },
    },
  },
}

/**
 * Distribution legend for doughnut chart
 */
const distributionLegend = computed(() => [
  {
    label: 'Stocks',
    value: formatNumber(dashboardData.value.stocks?.total || 0),
    color: chartColors.primary,
  },
  {
    label: 'Loans',
    value: formatNumber(dashboardData.value.loans?.total || 0),
    color: chartColors.info,
  },
  {
    label: 'Services',
    value: formatNumber(dashboardData.value.services?.total || 0),
    color: chartColors.warning,
  },
  {
    label: 'Users',
    value: formatNumber(dashboardData.value.users?.total || 0),
    color: chartColors.danger,
  },
])

/**
 * Growth rate chart data
 */
const growthRateChartData = computed(() => ({
  labels: ['Stocks', 'Loans', 'Services', 'Users'],
  datasets: [
    {
      label: 'Growth Rate (%)',
      data: [
        parseFloat(dashboardData.value.stocks?.percentage_change?.percentage || 0),
        parseFloat(dashboardData.value.loans?.percentage_change?.percentage || 0),
        parseFloat(dashboardData.value.services?.percentage_change?.percentage || 0),
        parseFloat(dashboardData.value.users?.percentage_change?.percentage || 0),
      ],
      backgroundColor: [
        dashboardData.value.stocks?.percentage_change?.direction === 'up'
          ? chartColors.success
          : chartColors.danger,
        dashboardData.value.loans?.percentage_change?.direction === 'up'
          ? chartColors.success
          : chartColors.danger,
        dashboardData.value.services?.percentage_change?.direction === 'up'
          ? chartColors.success
          : chartColors.danger,
        dashboardData.value.users?.percentage_change?.direction === 'up'
          ? chartColors.success
          : chartColors.danger,
      ],
      borderWidth: 0,
      borderRadius: 4,
    },
  ],
}))

/**
 * Growth rate chart options
 */
const growthRateChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${context.parsed.y}%`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#8e8e93',
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(142, 142, 147, 0.1)',
      },
      ticks: {
        color: '#8e8e93',
        callback: function (value) {
          return value + '%'
        },
      },
    },
  },
}

/**
 * Polar area chart data
 */
const polarAreaChartData = computed(() => ({
  labels: ['Stocks', 'Loans', 'Services', 'Users'],
  datasets: [
    {
      data: [
        dashboardData.value.stocks?.total || 0,
        dashboardData.value.loans?.total || 0,
        dashboardData.value.services?.total || 0,
        dashboardData.value.users?.total || 0,
      ],
      backgroundColor: [
        chartColors.primary + '80',
        chartColors.info + '80',
        chartColors.warning + '80',
        chartColors.danger + '80',
      ],
      borderColor: [chartColors.primary, chartColors.info, chartColors.warning, chartColors.danger],
      borderWidth: 2,
    },
  ],
}))

/**
 * Polar area chart options
 */
const polarAreaChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = formatNumber(context.parsed.r)
          return `${label}: ${value}`
        },
      },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      grid: {
        color: 'rgba(142, 142, 147, 0.1)',
      },
      ticks: {
        display: false,
      },
    },
  },
}

// Load data on component mount
onMounted(() => {
  fetchDashboardData()
})

// Auto-refresh every 5 minutes (optional)
// setInterval(() => {
//   fetchDashboardData()
// }, 300000) // 5 minutes

// Expose methods for parent components
defineExpose({
  refreshData,
  fetchDashboardData,
})

// Computed property to check if data is loaded
const isDataLoaded = computed(() => {
  return Object.keys(dashboardData.value).length > 0
})
</script>

<template>
  <div>
    <!-- Stats Cards Row -->
    <CRow :xs="{ gutter: 4 }" class="mb-4">
      <!-- Stocks Widget -->
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsA color="primary">
          <template #value>
            {{ formatNumber(dashboardData.stocks?.total || 0) }}
            <span class="fs-6 fw-normal">
              ({{ dashboardData.stocks?.percentage_change?.formatted || '0%' }}
              <CIcon :icon="getArrowIcon(dashboardData.stocks?.percentage_change?.direction)" />)
            </span>
          </template>
          <template #title>All Stocks Data</template>
          <template #chart>
            <CChart
              type="line"
              class="mt-3 mx-3"
              style="height: 70px"
              ref="widgetChartRef1"
              :data="{
                labels: dashboardData.chart_labels || [],
                datasets: [
                  {
                    label: 'Stocks',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: dashboardData.stocks?.chart_data || [],
                  },
                ],
              }"
              :options="getLineChartOptions(30, 100)"
            />
          </template>
        </CWidgetStatsA>
      </CCol>

      <!-- Loans Widget -->
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsA color="info">
          <template #value>
            {{ formatNumber(dashboardData.loans?.total || 0) }}
            <span class="fs-6 fw-normal">
              ({{ dashboardData.loans?.percentage_change?.formatted || '0%' }}
              <CIcon :icon="getArrowIcon(dashboardData.loans?.percentage_change?.direction)" />)
            </span>
          </template>
          <template #title>All Loans Data</template>
          <template #chart>
            <CChart
              type="line"
              class="mt-3 mx-3"
              style="height: 70px"
              ref="widgetChartRef2"
              :data="{
                labels: dashboardData.chart_labels || [],
                datasets: [
                  {
                    label: 'Loans',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: dashboardData.loans?.chart_data || [],
                  },
                ],
              }"
              :options="getLineChartOptions(-10, 50)"
            />
          </template>
        </CWidgetStatsA>
      </CCol>

      <!-- Services Widget -->
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsA color="warning">
          <template #value>
            {{ formatNumber(dashboardData.services?.total || 0) }}
            <span class="fs-6 fw-normal">
              ({{ dashboardData.services?.percentage_change?.formatted || '0%' }}
              <CIcon :icon="getArrowIcon(dashboardData.services?.percentage_change?.direction)" />)
            </span>
          </template>
          <template #title>All Services Data</template>
          <template #chart>
            <CChart
              type="line"
              class="mt-3"
              style="height: 70px"
              :data="{
                labels: dashboardData.chart_labels || [],
                datasets: [
                  {
                    label: 'Services',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: dashboardData.services?.chart_data || [],
                    fill: true,
                  },
                ],
              }"
              :options="getAreaChartOptions()"
            />
          </template>
        </CWidgetStatsA>
      </CCol>

      <!-- Users Widget -->
      <CCol :sm="6" :xl="4" :xxl="3">
        <CWidgetStatsA color="danger">
          <template #value>
            {{ formatNumber(dashboardData.users?.total || 0) }}
            <span class="fs-6 fw-normal">
              ({{ dashboardData.users?.percentage_change?.formatted || '0%' }}
              <CIcon :icon="getArrowIcon(dashboardData.users?.percentage_change?.direction)" />)
            </span>
          </template>
          <template #title>All Users</template>
          <template #chart>
            <CChart
              type="bar"
              class="mt-3 mx-3"
              style="height: 70px"
              :data="{
                labels: dashboardData.chart_labels || [],
                datasets: [
                  {
                    label: 'Users',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: dashboardData.users?.chart_data || [],
                    barPercentage: 0.6,
                  },
                ],
              }"
              :options="getBarChartOptions()"
            />
          </template>
        </CWidgetStatsA>
      </CCol>
    </CRow>

    <!-- Comprehensive Charts Section -->
    <CRow :xs="{ gutter: 4 }" class="mb-4">
      <!-- Combined Line Chart -->
      <CCol :lg="8">
        <CCard class="mb-4">
          <CCardBody>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 class="card-title">Monthly Trends Overview</h4>
                <p class="card-text text-muted">All categories comparison over the last 7 months</p>
              </div>
              <div class="d-flex gap-2">
                <CButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  @click="chartType = 'line'"
                  :class="{ active: chartType === 'line' }"
                >
                  Line
                </CButton>
                <CButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  @click="chartType = 'bar'"
                  :class="{ active: chartType === 'bar' }"
                >
                  Bar
                </CButton>
              </div>
            </div>
            <CChart
              :type="chartType"
              :data="combinedChartData"
              :options="combinedChartOptions"
              style="height: 400px"
              ref="combinedChartRef"
            />
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Doughnut Chart -->
      <CCol :lg="4">
        <CCard class="mb-4">
          <CCardBody>
            <h4 class="card-title mb-3">Current Distribution</h4>
            <CChart
              type="doughnut"
              :data="doughnutChartData"
              :options="doughnutChartOptions"
              style="height: 300px"
              ref="doughnutChartRef"
            />
            <div class="mt-3">
              <div
                class="d-flex justify-content-between align-items-center mb-2"
                v-for="(item, index) in distributionLegend"
                :key="index"
              >
                <div class="d-flex align-items-center">
                  <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                  <span class="small">{{ item.label }}</span>
                </div>
                <strong class="small">{{ item.value }}</strong>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Detailed Analytics Row -->
    <CRow :xs="{ gutter: 4 }">
      <!-- Growth Rate Chart -->
      <CCol :lg="6">
        <CCard class="mb-4">
          <CCardBody>
            <h4 class="card-title mb-3">Growth Rate Comparison</h4>
            <CChart
              type="bar"
              :data="growthRateChartData"
              :options="growthRateChartOptions"
              style="height: 300px"
              ref="growthRateChartRef"
            />
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Polar Area Chart -->
      <CCol :lg="6">
        <CCard class="mb-4">
          <CCardBody>
            <h4 class="card-title mb-3">Data Volume Analysis</h4>
            <CChart
              type="polarArea"
              :data="polarAreaChartData"
              :options="polarAreaChartOptions"
              style="height: 300px"
              ref="polarAreaChartRef"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
      style="height: 200px"
    >
      <CSpinner color="primary" />
    </div>

    <!-- Error Alert -->
    <CAlert v-if="error" color="danger" :visible="true" dismissible @close="error = null">
      <strong>Error!</strong> {{ error }}
    </CAlert>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
.fs-6 {
  font-size: 0.875rem;
}

.fw-normal {
  font-weight: normal;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 8px;
  display: inline-block;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.875rem;
}

.btn.active {
  background-color: var(--cui-primary);
  border-color: var(--cui-primary);
  color: white;
}

.small {
  font-size: 0.875rem;
}
</style>
