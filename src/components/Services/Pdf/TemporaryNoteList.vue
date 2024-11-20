<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2>Temporary Note</h2>
    <form @submit.prevent="generatePDF" class="space-y-6">
      <!-- Previous template code remains the same -->
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-3">
          <label class="form-label fw-semibold">No Invoice</label>
          <input
            v-model="invoice.invoiceNo"
            type="text"
            class="form-control shadow-none w-50"
            placeholder="Input Invoice"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Date:</label>
          <input v-model="invoice.date" type="date" class="form-control shadow-none w-50" />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Bill To:</label>
        <textarea
          v-model="invoice.billTo"
          class="form-control shadow-none w-50"
          rows="4"
          placeholder="Input Billing Address"
        ></textarea>
      </div>

      <div>
        <h3 class="text-lg font-medium mb-2">Items</h3>
        <table class="w-full border-collapse border">
          <thead>
            <tr>
              <th class="border p-2">Items</th>
              <th class="border p-2">Quantity</th>
              <th class="border p-2">Price (Rp)</th>
              <th class="border p-2">Amount (Rp)</th>
              <th class="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in invoice.items" :key="index">
              <td class="border p-2">
                <input v-model="item.description" type="text" class="w-full" />
              </td>
              <td class="border p-2">
                <input
                  v-model.number="item.quantity"
                  type="number"
                  class="w-full"
                  @input="calculateItemAmount(index)"
                />
              </td>
              <td class="border p-2">
                <input
                  v-model.number="item.price"
                  type="number"
                  class="w-full"
                  @input="calculateItemAmount(index)"
                />
              </td>
              <td class="border p-2">
                {{ formatCurrency(item.amount) }}
              </td>
              <td class="border p-2">
                <button
                  @click="removeItem(index)"
                  type="button"
                  class="btn btn-danger btn-sm text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="space-y-2">
          <div class="d-flex justify-content-end w-50">
            <span>Total:</span>
            <span>{{ formatCurrency(subTotal) }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex">
        <button @click="addItem" type="button" class="add-table btn btn-danger btn-sm text-white">
          Add Item
        </button>
        <button type="submit" class="w-full btn btn-primary btn-sm text-white">Generate PDF</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// State
const invoice = ref({
  invoiceNo: '',
  date: '',
  billTo: '',
  items: [
    {
      description: '',
      quantity: 1,
      price: 0,
      amount: 0,
    },
  ],
})

// Create an Image object for logo preloading
const logo = new Image()
const logoLoaded = ref(false)
const logoError = ref(false)
const signatureLogoLoaded = ref(false)
const signatureLogoError = ref(false)
const signatureLogo = new Image()

onMounted(() => {
  // Set up logo loading
  logo.onload = () => {
    logoLoaded.value = true
  }
  logo.onerror = () => {
    logoError.value = true
    console.error('Error loading logo')
  }

  signatureLogo.onload = () => {
    signatureLogoLoaded.value = true
  }

  signatureLogo.onerror = () => {
    signatureLogoError.value = true
  }

  logo.src = '/src/assets/images/darivisi.png'
  signatureLogo.src = '/src/assets/images/ttd.png'
})

// Computed properties
const subTotal = computed(() => {
  return invoice.value.items.reduce((sum, item) => sum + item.amount, 0)
})

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

const calculateItemAmount = (index) => {
  const item = invoice.value.items[index]
  item.amount = item.quantity * item.price
}

const addItem = () => {
  invoice.value.items.push({
    description: '',
    quantity: 1,
    price: 0,
    amount: 0,
  })
}

const removeItem = (index) => {
  invoice.value.items.splice(index, 1)
}

const generatePDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Set initial font styles
  doc.setFont('helvetica')

  // Add Company Logo only if it's loaded successfully
  if (logoLoaded.value && !logoError.value) {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = logo.width
      canvas.height = logo.height
      ctx.drawImage(logo, 0, 0)
      const logoDataUrl = canvas.toDataURL('image/png')
      doc.addImage(logoDataUrl, 'PNG', 12, 12, 24, 24)
    } catch (error) {
      console.error('Error adding logo to PDF:', error)
    }
  }

  // Add Company Information (right-aligned)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PT. Dari Visi Teknologi', doc.internal.pageSize.width - 15, 20, { align: 'right' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Equity Tower 22nd Floor (SC25)', doc.internal.pageSize.width - 15, 25, {
    align: 'right',
  })
  doc.text('Jl.Sudirman No.22, RT.5/RW.3, Senayan, CBD', doc.internal.pageSize.width - 15, 30, {
    align: 'right',
  })
  doc.text('Jakarta Selatan 12190', doc.internal.pageSize.width - 15, 35, { align: 'right' })

  // horizontal line
  doc.setLineWidth(0.5)
  doc.line(10, 50, doc.internal.pageSize.width - 10, 50)

  const pageWidth = doc.internal.pageSize.width

  // PROFORMA INVOICE title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  const titleWidth = doc.getTextWidth('PROFORMA INVOICE')
  doc.text('PROFORMA INVOICE', (pageWidth - titleWidth) / 2, 65)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const rightColumnX = pageWidth - 85
  doc.text(`Proforma Invoice No : ${invoice.value.invoiceNo}`, rightColumnX, 80)
  doc.text(`Date : ${formatDate(invoice.value.date)}`, rightColumnX, 85)
  doc.text('PO / SO No. :', rightColumnX, 90)
  doc.text(``, rightColumnX + 45, 90)

  // billing information
  doc.text('BILL TO:', 15, 80)
  const billToLines = invoice.value.billTo.split('\n')
  billToLines.forEach((line, index) => {
    doc.text(line, 15, 85 + index * 5)
  })

  // Add items table with total row
  const tableData = invoice.value.items.map((item) => [
    item.description,
    item.quantity,
    formatCurrency(item.price),
    formatCurrency(item.amount),
  ])

  // Add total row to the table
  tableData.push([
    { content: 'Total', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
    { content: formatCurrency(subTotal.value), styles: { fontStyle: 'bold', halign: 'right' } },
  ])

  doc.autoTable({
    startY: 120,
    head: [['Items', 'Quantity', 'Price', 'Amount']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      fontSize: 9,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 15, right: 15 },
  })

  const finalY = doc.lastAutoTable.finalY + 5

  const signatureY = finalY + 10
  const rightMargin = 15
  const signatureWidth = 50
  const signatureHeight = 25

  doc.setFont('helvetica', 'bold')
  doc.text('PT. DARI VISI TEKNOLOGI', doc.internal.pageSize.width - rightMargin, signatureY, {
    align: 'right',
  })

  if (signatureLogoLoaded.value && !signatureLogoError.value) {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = signatureLogo.width
      canvas.height = signatureLogo.height
      ctx.drawImage(signatureLogo, 0, 0)
      const signatureLogoDataUrl = canvas.toDataURL('image/png')

      const signatureX = doc.internal.pageSize.width - rightMargin - signatureWidth

      doc.addImage(
        signatureLogoDataUrl,
        'PNG',
        signatureX,
        signatureY + 5, // Add 5mm spacing between text and logo
        signatureWidth,
        signatureHeight,
      )

      doc.text(
        'Finance Dept',
        doc.internal.pageSize.width - rightMargin,
        signatureY + 5 + signatureHeight + 5,
        { align: 'right' },
      )
    } catch (error) {
      console.error('Error adding signature logo to PDF:', error)
    }
  }

  // Add payment information
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  const paymentY = finalY + 65
  doc.text('For Payment, please remit to:', 15, paymentY)
  doc.setFont('helvetica', 'bold')
  doc.text('PT.Dari Visi Teknologi', 15, paymentY + 5)

  doc.setFontSize(8)
  doc.text('BCA - Jakarta Acc. No. 746-0330429', 15, paymentY + 10)
  doc.text('BRI - Jakarta Acc. No.1223-01-001431-30-8', 15, paymentY + 15)

  // Save PDF
  doc.save(`invoice-${invoice.value.invoiceNo}.pdf`)
}
</script>

<style scoped>
input:focus,
textarea:focus {
  border-color: #d22c36;
}

.add-table {
  margin-right: 1rem;
}
</style>
