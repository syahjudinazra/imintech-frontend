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
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${day}${month}${year}_${hours}${minutes}`
}

const exportExcel = async () => {
  loading.value = true
  try {
    const response = await axios.get('export-customers', {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)

    const downloadDate = getFormattedDate()
    link.download = `Customers-Data_${downloadDate}.xlsx`

    link.click()
    showToast('Excel file exported successfully!', 'success')
  } catch (error) {
    console.error('Error exporting Excel:', error)
    showToast('Failed to export Excel file. Please try again.', 'error')
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
