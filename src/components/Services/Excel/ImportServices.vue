<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { CIcon } from '@coreui/icons-vue'
import { cilCloudUpload } from '@coreui/icons'
import { showToast } from '@/utilities/toast'

const fileInput = ref(null)
const loading = ref(false)
const error = ref('')

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
      const response = await axios.post('services-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN':
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        withCredentials: true,
      })
      console.log('Excel import successful:', response.data)
      showToast('Excel file imported successfully!', 'success')
    } catch (err) {
      error.value = err.response?.data?.data || 'An error occurred during the import process.'
      showToast('Failed to import Excel file. Please try again.', 'error')
    } finally {
      loading.value = false
    }
  }
}

const downloadTemplate = async () => {
  try {
    const response = await axios.get('services-template', {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Template-Import-Services.xlsx')
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

<style scoped>
.loader {
  --w: 10ch;
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  line-height: 1.2em;
  letter-spacing: var(--w);
  width: var(--w);
  overflow: hidden;
  white-space: nowrap;
  color: #0000;
  animation: l19 2s infinite linear;
}
.loader:before {
  content: 'Downloading...';
}

@keyframes l19 {
  0% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  4% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  8% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  12% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  16% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0,
      calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  20% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0,
      calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  24% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  28% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0,
      calc(-9 * var(--w)) 0;
  }
  32% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0,
      calc(-9 * var(--w)) 0;
  }
  36% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0;
  }
  40%,
  60% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  64% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0 #000, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  68% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0 #000,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  72% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0 #000, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  76% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  80% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  84% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  88% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  92% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  96% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0 #000;
  }
  100% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0, calc(-2 * var(--w)) 0,
      calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
}
</style>
