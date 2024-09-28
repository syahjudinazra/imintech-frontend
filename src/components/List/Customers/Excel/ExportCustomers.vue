<template>
  <div class="export-container">
    <button
      @click="exportExcel"
      type="button"
      class="btn btn-secondary btn-sm mr-2"
      :disabled="loading"
    >
      <CIcon :icon="cilCloudDownload" style="color: white" />
      <span>{{ loading ? 'Downloading...' : 'Export Excel' }}</span>
    </button>
    <p v-if="error" class="error-message" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { CIcon } from '@coreui/icons-vue'
import { cilCloudDownload } from '@coreui/icons'
import { showToast } from '@/utilities/toast'

const loading = ref(false)
const error = ref('')

const getFormattedDate = () => {
  const now = new Date()
  return now
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14)
}

const exportExcel = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('customers-export', {
      responseType: 'blob',
    })

    // Check if the response is actually an error message
    if (response.data.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = function () {
        const errorResponse = JSON.parse(reader.result)
        throw new Error(errorResponse.message || 'Unknown error occurred')
      }
      reader.readAsText(response.data)
      return
    }

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)

    const downloadDate = getFormattedDate()
    link.download = `Customers-Data_${downloadDate}.xlsx`

    link.click()
    window.URL.revokeObjectURL(link.href)
    showToast('Excel file exported successfully!', 'success')
  } catch (err) {
    console.error('Error exporting Excel:', err)
    error.value = err.message || 'Failed to export Excel file. Please try again.'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.btn {
  transition: opacity 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
