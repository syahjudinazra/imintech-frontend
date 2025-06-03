<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { CIcon } from '@coreui/icons-vue'
import { cilCloudUpload } from '@coreui/icons'
import { showToast } from '@/utilities/toast'

const fileInput = ref(null)
const loading = ref(false)
const error = ref('') // Track error message

const importExcel = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  loading.value = true
  error.value = ''
  const file = event.target.files[0]

  if (file) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('stocks-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN':
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        withCredentials: true,
      })
      console.log('Excel import successful:', response.data)
      showToast('Excel file imported successfully!', 'success')

      // Reset file input after successful upload
      event.target.value = ''
    } catch (err) {
      // Get error details from response
      const errorData = err.response?.data
      const errorMessage = errorData?.message || errorData?.data || ''
      const errorCode = errorData?.code || ''

      console.error('Import error:', errorData)

      // Check for duplicate serial number error
      if (
        errorCode === 'DUPLICATE_SERIAL_NUMBER' ||
        errorCode === 'duplicate_serial_number' ||
        (typeof errorMessage === 'string' &&
          errorMessage.toLowerCase().includes('duplicate') &&
          errorMessage.toLowerCase().includes('serial'))
      ) {
        showToast('Failed Import, Serial Number Duplicate', 'error')
        error.value = 'Duplicate serial numbers detected in the Excel file.'
      } else if (errorData?.errors) {
        // Handle validation errors (Laravel validation format)
        const validationErrors = Object.values(errorData.errors).flat()
        const hasDuplicateError = validationErrors.some(
          (err) => err.toLowerCase().includes('duplicate') && err.toLowerCase().includes('serial'),
        )

        if (hasDuplicateError) {
          showToast('Failed Import, Serial Number Duplicate', 'error')
          error.value = 'Duplicate serial numbers detected in the Excel file.'
        } else {
          showToast('Failed to import Excel file. Please check your data.', 'error')
          error.value = validationErrors.join('; ')
        }
      } else {
        // Generic error handling
        showToast('Failed to import Excel file. Please try again.', 'error')
        error.value = errorMessage || 'An error occurred during the import process.'
      }

      // Reset file input on error
      event.target.value = ''
    } finally {
      loading.value = false
    }
  }
}

const downloadTemplate = async () => {
  try {
    const response = await axios.get('stocks-template', {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Template-Import-Stocks.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Download template successfully!', 'success')
  } catch (error) {
    console.error('Error downloading template:', error)
    showToast('Download template failed!', 'error')
  }
}
</script>

<template>
  <div class="btn-group">
    <button
      @click="importExcel"
      type="button"
      class="btn btn-secondary btn-sm"
      data-bs-toggle="modal"
      data-bs-target="#importModal"
      :disabled="loading"
    >
      <CIcon :icon="cilCloudUpload" style="color: white" />
      <span>{{ loading ? 'Uploading...' : 'Import Excel' }}</span>
    </button>
    <button
      type="button"
      class="btn btn-secondary btn-sm dropdown-toggle dropdown-toggle-split"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      style="display: none"
      accept=".xlsx, .xls"
    />
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" @click="downloadTemplate">Download Template</a></li>
    </ul>
  </div>
</template>
