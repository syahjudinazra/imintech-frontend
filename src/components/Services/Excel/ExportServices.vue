<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { CIcon } from '@coreui/icons-vue'
import { cilCloudDownload } from '@coreui/icons'
import { showToast } from '@/utilities/toast'

const loading = ref(false)
const showDateModal = ref(false)
const dateRange = ref({
  startDate: '',
  endDate: '',
})

const today = new Date().toISOString().split('T')[0]

const exportExcel = async () => {
  loading.value = true

  try {
    const response = await axios.get('/services-export', {
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Services-Data-${today}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    showToast('Full export completed successfully!', 'success')
  } catch (error) {
    console.error('Error exporting all data:', error)
    showToast('Export all data failed!', 'error')
  } finally {
    loading.value = false
  }
}

const openDateModal = () => {
  showDateModal.value = true
  // Set default dates (optional)
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())

  dateRange.value.endDate = today.toISOString().split('T')[0]
  dateRange.value.startDate = lastMonth.toISOString().split('T')[0]
}

const closeDateModal = () => {
  showDateModal.value = false
  dateRange.value = {
    startDate: '',
    endDate: '',
  }
}

const validateDateRange = () => {
  if (!dateRange.value.startDate || !dateRange.value.endDate) {
    showToast('Please select both start and end dates', 'error')
    return false
  }

  if (new Date(dateRange.value.startDate) > new Date(dateRange.value.endDate)) {
    showToast('Start date cannot be later than end date', 'error')
    return false
  }

  return true
}

const exportByDate = async () => {
  if (!validateDateRange()) return

  loading.value = true

  try {
    const response = await axios.get('/export-date', {
      params: {
        start_date: dateRange.value.startDate,
        end_date: dateRange.value.endDate,
      },
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `Services-Data-${dateRange.value.startDate}-to-${dateRange.value.endDate}.xlsx`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    showToast('Export by date completed successfully!', 'success')
    closeDateModal()
  } catch (error) {
    console.error('Error exporting by date:', error)
    showToast('Export by date failed!', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="export-container btn-group">
    <button
      @click="exportExcel"
      type="button"
      class="btn btn-secondary btn-sm mr-2"
      :disabled="loading"
    >
      <CIcon :icon="cilCloudDownload" style="color: white" />
      <span>{{ loading ? 'Downloading...' : 'Export Excel' }}</span>
    </button>
    <button
      ref="dropdownElementRef"
      type="button"
      class="btn btn-secondary btn-sm dropdown-toggle dropdown-toggle-split"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :disabled="loading"
    >
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" @click="openDateModal">Export by date</a></li>
    </ul>

    <!-- Date Range Modal -->
    <div
      class="modal fade"
      :class="{ show: showDateModal }"
      :style="{ display: showDateModal ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="closeDateModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Date Range for Export</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDateModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="startDate" class="form-label">Start Date</label>
                <input
                  id="startDate"
                  v-model="dateRange.startDate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label for="endDate" class="form-label">End Date</label>
                <input
                  id="endDate"
                  v-model="dateRange.endDate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
            </div>
            <div class="mt-3">
              <small class="text-muted">
                Select the date range for which you want to export the data.
              </small>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeDateModal"
              :disabled="loading"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="exportByDate" :disabled="loading">
              <span v-if="loading">
                <span
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Exporting...
              </span>
              <span v-else>
                <CIcon :icon="cilCloudDownload" class="me-2" />
                Export
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div v-if="showDateModal" class="modal-backdrop fade show" @click="closeDateModal"></div>
  </div>
</template>

<style scoped>
.btn {
  transition: opacity 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
