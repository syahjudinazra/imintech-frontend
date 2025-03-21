<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { showToast } from '@/utilities/toast'
import { Modal } from 'bootstrap'
import { cilPlus, cilTrash } from '@coreui/icons'

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'download'])

// For Bootstrap modal
const modalInstance = ref(null)

// Logo handling
const logoUrl = ref('/src/assets/images/darivisi.png')
const logoLoaded = ref(false)
const logoError = ref(false)
const logo = new Image()

logo.onload = () => {
  logoLoaded.value = true
}

logo.onerror = () => {
  logoError.value = true
  console.error('Error loading logo')
}

logo.src = logoUrl.value

// Day names in Indonesian
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const formatDate = (date) => {
  if (!date) return '-'
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return '-'
    const dayName = dayNames[dateObj.getDay()]
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${dayName}, ${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

// Reactive data
const offeringData = ref({
  customerName: '',
  address: '',
  serialNumber: '',
  damage: '',
  repair: '',
  ticket_services: '',
  items: [
    {
      description: '',
      quantity: 1,
      price: 0,
      total: 0,
    },
  ],
  shippingCost: 0,
  uniqueDigit: 0, // Now editable directly in the form
  offeringDate: formatDate(new Date()),
})

// Computed properties for calculations
const subtotal = computed(() => {
  return offeringData.value.items.reduce((sum, item) => sum + item.total, 0)
})

const ppn = computed(() => {
  return subtotal.value * 0.11
})

const total = computed(() => {
  return (
    subtotal.value +
    ppn.value +
    parseFloat(offeringData.value.shippingCost || 0) +
    parseFloat(offeringData.value.uniqueDigit || 0)
  )
})

// Methods
const calculateItemTotal = (index) => {
  const item = offeringData.value.items[index]
  item.total = item.quantity * item.price
}

const addItem = () => {
  offeringData.value.items.push({
    description: '',
    quantity: 1,
    price: 0,
    total: 0,
  })
}

const removeItem = (index) => {
  offeringData.value.items.splice(index, 1)
}

const calculateTotals = () => {
  // This function is called when shipping cost or unique digit changes
  // The subtotal, ppn, and total are computed properties
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

// Generate PDF on the client side
const generateOffering = () => {
  try {
    // Generate PPA number
    const today = new Date()
    const year = today.getFullYear().toString().substring(2)
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const day = today.getDate().toString().padStart(2, '0')
    const uniqueNumber = offeringData.value.uniqueDigit

    const ppaNumber = `PPA-${day}${month}${year}-${uniqueNumber}`

    // Create new jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Add Company Logo only if it's loaded successfully
    if (logoLoaded.value && !logoError.value) {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = logo.width
        canvas.height = logo.height
        ctx.drawImage(logo, 0, 0)
        const logoDataUrl = canvas.toDataURL('image/png')
        // Adjust logo position and size to match the template
        doc.addImage(logoDataUrl, 'PNG', 15, 15, 20, 20)
      } catch (error) {
        console.error('Error adding logo to PDF:', error)
      }
    }

    // Add horizontal line at the top of the logo
    doc.setDrawColor(150, 150, 150) // Medium gray color
    doc.setLineWidth(1)
    doc.line(15, 40, 195, 40)

    // Company name
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('PT Dari Visi Teknologi', 40, 20)

    // Company address
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Pergudangan Ecopark Kapuk Unit 8G/8R,', 40, 25)
    doc.text('Jl. Kapuk Kayu Besar No.28B, RT.12/RW.1,', 40, 30)
    doc.text('Kamal Muara, Penjaringan, Jakarta Utara 14470', 40, 35)

    // Offering Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Penawaran Perbaikan', 195, 20, { align: 'right' })

    // Document number
    doc.setFontSize(10)
    doc.text(`# ${ppaNumber}`, 195, 30, { align: 'right' })

    // Payment info box
    doc.rect(145, 45, 50, 20)
    doc.setFontSize(8)
    doc.text('Nomor Rekening Pembayaran:', 150, 50)
    doc.setFont('helvetica', 'bold')
    doc.text('PT Dari Visi Teknologi', 150, 55)
    doc.text('BCA - 7460396071', 150, 60)

    // Customer info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Kepada:', 15, 50)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 102, 204)
    doc.text(offeringData.value.customerName.toUpperCase(), 15, 55)

    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')

    // Split the address text to handle long addresses
    const addressMaxWidth = 90
    const addressLines = doc.splitTextToSize(offeringData.value.address, addressMaxWidth)

    // Calculate the starting y position for address
    let currentYPosition = 60

    // Print each line of the address
    addressLines.forEach((line, index) => {
      doc.text(line, 15, currentYPosition + index * 5)
    })

    // Update the Y position after the address
    currentYPosition = 60 + addressLines.length * 5 + 5

    // Add Serial Number with proper spacing
    doc.setFontSize(9)
    doc.text(`Nomor Seri Device: ${offeringData.value.serialNumber}`, 15, currentYPosition)

    // Update the Y position after the serial number
    currentYPosition += 10

    // Add Hasil Pengecekan section
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Hasil Pengecekan:', 15, currentYPosition)

    // Update the Y position for the check results content
    currentYPosition += 5

    doc.setFont('helvetica', 'normal')

    // Set a wider max width for damage and repair text
    const damageRepairMaxWidth = 180

    // Handle damage text with wrapping if needed
    if (offeringData.value.damage) {
      const damageLines = doc.splitTextToSize(offeringData.value.damage, damageRepairMaxWidth)

      damageLines.forEach((line, index) => {
        doc.text(line, 15, currentYPosition + index * 5)
      })

      // Update the Y position after the damage text
      currentYPosition = currentYPosition + damageLines.length * 5 + 2
    }

    // Handle repair text with wrapping if needed
    if (offeringData.value.repair) {
      const repairLines = doc.splitTextToSize(offeringData.value.repair, damageRepairMaxWidth)

      repairLines.forEach((line, index) => {
        doc.text(line, 15, currentYPosition + index * 5)
      })

      // Update the Y position after the repair text
      currentYPosition = currentYPosition + repairLines.length * 5 + 5
    }

    // Date of offering
    doc.text(`Tanggal Penawaran: ${formatDate(today)}`, 132, 130)

    // Items table
    doc.autoTable({
      startY: 135,
      head: [['#', 'Item & Deskripsi', 'Jml', 'Tarif', 'Jumlah']],
      body: offeringData.value.items.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        formatCurrency(item.price),
        formatCurrency(item.total),
      ]),
      foot: [
        ['', '', '', 'Sub Total', formatCurrency(subtotal.value)],
        ['', '', '', 'PPN 11%', formatCurrency(ppn.value)],
        [
          '',
          '',
          '',
          'Biaya Pengiriman',
          formatCurrency(parseFloat(offeringData.value.shippingCost || 0)),
        ],
        ['', '', '', 'Digit unik', formatCurrency(parseFloat(offeringData.value.uniqueDigit || 0))],
        ['', '', '', 'Total', `IDR${formatCurrency(total.value)}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'right', // This aligns all footer text to the right
      },
      // Make only the "Total" row have a grey background
      didDrawCell: (data) => {
        if (data.section === 'foot' && data.row.index === 4) {
          // Last row in footer (Total)
          doc.setFillColor(240, 240, 240)
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F')
          doc.setTextColor(0, 0, 0)
          if (data.column.index >= 3) {
            doc.setFont('helvetica', 'bold')
            doc.text(
              data.cell.text,
              data.cell.x + data.cell.width - 2,
              data.cell.y + data.cell.height / 2,
              {
                align: 'right',
                baseline: 'middle',
              },
            )
          }
        }
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
    })
    // Add note at the bottom with right alignment
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(8)
    doc.text('*Pastikan jumlah transfer sesuai dengan invoice', 195, finalY, { align: 'right' })
    doc.text('termasuk 3 digit unik terakhir', 195, finalY + 4, { align: 'right' })

    // Add a new page for Terms and Conditions
    doc.addPage()

    // Title for Terms and Conditions
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Ketentuan Layanan Perbaikan :', 20, 30)

    // 1. Service Timeframe Section
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('1. Waktu Pengerjaan:', 20, 65)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Waktu pengerjaan perbaikan adalah maksimal 4 (empat) hari kerja, tidak termasuk waktu pengiriman.',
      25,
      72,
    )
    doc.text('• Waktu pengerjaan dihitung sejak perangkat diterima di Service Center kami.', 25, 79)
    doc.text(
      '• Pengerjaan unit di luar garansi akan dilakukan setelah pembayaran diterima.',
      25,
      86,
    )

    // 2. Service Warranty Section
    doc.setFont('helvetica', 'bold')
    doc.text('2. Garansi Layanan:', 20, 98)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Untuk layanan perbaikan tanpa penggantian suku cadang, diberikan garansi selama 1 (satu) bulan.',
      25,
      105,
    )
    doc.text(
      '• Untuk layanan perbaikan dengan penggantian suku cadang, diberikan garansi selama 3 (tiga) bulan.',
      25,
      112,
    )
    doc.text(
      '• Garansi mencakup perbaikan ulang terhadap masalah yang sama yang terjadi selama masa garansi.',
      25,
      119,
    )

    // 3. Inspection Fee Section
    doc.setFont('helvetica', 'bold')
    doc.text('3. Biaya Pemeriksaan:', 20, 131)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Pelanggan akan dikenakan biaya pemeriksaan sebesar Rp50.000 (lima puluh ribu rupiah).',
      25,
      138,
    )
    doc.text('  Biaya pemeriksaan dikenakan dalam kondisi berikut:', 25, 145)
    doc.text(
      '    - Pelanggan tidak menyetujui saran perbaikan yang diberikan oleh teknisi.',
      25,
      152,
    )
    doc.text(
      '    - Setelah pemeriksaan, tidak ditemukan kerusakan pada perangkat yang dikirimkan.',
      25,
      159,
    )

    // 4. Other Terms Section
    doc.setFont('helvetica', 'bold')
    doc.text('4. Ketentuan Lain', 20, 171)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Service Center berhak menolak perbaikan, jika perangkat yang di terima, tidak sesuai dengan standar',
      25,
      178,
    )
    doc.text('  operasional perusahaan.', 25, 185)
    doc.text(
      '• Pelanggan wajib memberikan informasi yang benar, dan lengkap terkait kerusakan perangkat.',
      25,
      192,
    )
    doc.text(
      '• Service Center tidak bertanggung jawab atas kehilangan data, yang terjadi selama proses perbaikan.',
      25,
      199,
    )
    doc.text(
      '• Biaya pengiriman perangkat ke Service Center, dan pengiriman perangkat kembali ke pelanggan, di',
      25,
      206,
    )
    doc.text('  tanggung oleh pelanggan.', 25, 213)
    doc.text(
      '• Apabila unit selesai atau batal servis tidak diambil lebih dari 3 (tiga) bulan kalender sejak diterima di',
      25,
      220,
    )
    doc.text(
      '  Service Center, berhak melakukan proses daur ulang (recycle) dan unit tidak dapat diambil kembali.',
      25,
      227,
    )

    // Notes Section
    doc.setFont('helvetica', 'bold')
    doc.text('Catatan:', 20, 240)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Syarat dan ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.',
      25,
      247,
    )
    doc.text(
      '• Dengan menggunakan layanan kami, pelanggan dianggap telah membaca dan menyetujui syarat dan',
      25,
      254,
    )
    doc.text('  ketentuan ini.', 25, 261)

    // Save the PDF
    doc.save(`${ppaNumber}.pdf`)

    // Create offering data object with combined damage and repair descriptions
    const offeringForDownload = {
      ...offeringData.value,
      damageDescription: `Kerusakan: ${offeringData.value.damage}\nPerbaikan: ${offeringData.value.repair}`,
      ppaNumber,
      date: formatDate(today),
      subtotal: subtotal.value,
      ppn: ppn.value,
      total: total.value,
    }

    showToast('Offering downloaded successfully', 'success')
    emit('download', offeringForDownload)
    emit('close')
  } catch (error) {
    console.error('Error generating offering:', error)
  }
}

// Watch for changes in props
watch(
  () => props.service,
  (newValue) => {
    if (newValue) {
      // Populate form with service data
      offeringData.value.customerName = newValue.customers || ''
      offeringData.value.serialNumber = newValue.serial_number || ''
      offeringData.value.address = newValue.address || ''
      offeringData.value.damage = newValue.damage || ''
      offeringData.value.repair = newValue.repair || ''
      offeringData.value.ticket_services = newValue.ticket_services || ''

      // Reset items
      offeringData.value.items = [
        {
          description: '',
          quantity: 1,
          price: 0,
          total: 0,
        },
      ]
      offeringData.value.shippingCost = 0
    }
  },
  { immediate: true, deep: true },
)

const showModal = () => {
  if (!modalInstance.value) {
    const modalElement = document.getElementById('downloadOfferingModal')
    modalInstance.value = new Modal(modalElement)
  }
  modalInstance.value.show()
}

const hideModal = () => {
  if (modalInstance.value) {
    modalInstance.value.hide()
  }
  emit('close')
}

// Expose methods to parent component
defineExpose({
  showModal,
  hideModal,
})

onMounted(() => {
  // Initialize modal
  const modalElement = document.getElementById('downloadOfferingModal')
  modalInstance.value = new Modal(modalElement)
})
</script>

<template>
  <div
    class="modal fade"
    id="downloadOfferingModal"
    tabindex="-1"
    aria-labelledby="downloadOfferingModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="downloadOfferingModalLabel">Download Offering</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-2">
            <label for="customerName" class="form-label fw-bold">Customer</label>
            <input
              type="text"
              class="form-control shadow-none bg-light"
              id="customerName"
              v-model="offeringData.customerName"
              readonly
            />
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="ticket_services" class="form-label fw-bold">Ticket Service</label>
                <input
                  type="text"
                  class="form-control shadow-none bg-light"
                  id="ticket_services"
                  v-model="offeringData.ticket_services"
                  readonly
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="serialNumber" class="form-label fw-bold">Serial Number</label>
                <input
                  type="text"
                  class="form-control shadow-none bg-light"
                  id="serialNumber"
                  v-model="offeringData.serialNumber"
                  readonly
                />
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-12">
              <div class="form-group">
                <label for="address" class="form-label fw-bold">Address</label>
                <textarea
                  class="form-control shadow-none bg-light"
                  id="address"
                  v-model="offeringData.address"
                  rows="2"
                  readonly
                ></textarea>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="form-group">
                <label for="damage" class="form-label fw-bold">Damage</label>
                <textarea
                  class="form-control shadow-none bg-light"
                  id="damage"
                  v-model="offeringData.damage"
                  rows="2"
                  readonly
                ></textarea>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="repair" class="form-label fw-bold">Repair</label>
                <textarea
                  class="form-control shadow-none bg-light"
                  id="repair"
                  v-model="offeringData.repair"
                  rows="2"
                  readonly
                ></textarea>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th width="50">#</th>
                  <th>Item & Deskripsi</th>
                  <th width="80">Jml</th>
                  <th width="120">Tarif</th>
                  <th width="120">Jumlah</th>
                  <th width="80">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in offeringData.items" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input
                      type="text"
                      class="form-control shadow-none"
                      v-model="item.description"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control shadow-none"
                      v-model="item.quantity"
                      @input="calculateItemTotal(index)"
                      min="1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control shadow-none"
                      v-model="item.price"
                      @input="calculateItemTotal(index)"
                    />
                  </td>
                  <td>{{ formatCurrency(item.total) }}</td>
                  <td>
                    <button
                      v-if="index > 0"
                      class="btn btn-sm btn-danger"
                      @click="removeItem(index)"
                    >
                      <CIcon :icon="cilTrash" class="text-white" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6">
                    <button class="btn btn-sm btn-danger text-white" @click="addItem">
                      <CIcon :icon="cilPlus" class="text-white" /> Add Item
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label for="shippingCost" class="form-label fw-bold">Biaya Pengiriman</label>
                <input
                  type="number"
                  class="form-control shadow-none"
                  id="shippingCost"
                  v-model="offeringData.shippingCost"
                  @input="calculateTotals"
                />
              </div>
              <div class="form-group">
                <label for="uniqueDigit" class="form-label fw-bold">Digit Unik</label>
                <input
                  type="number"
                  class="form-control shadow-none"
                  id="uniqueDigit"
                  v-model="offeringData.uniqueDigit"
                  @input="calculateTotals"
                />
                <small class="text-muted">Masukan 3 digit terakhir dari Ticket Service</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <span>Sub Total:</span>
                    <strong>{{ formatCurrency(subtotal) }}</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>PPN 11%:</span>
                    <strong>{{ formatCurrency(ppn) }}</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Biaya Pengiriman:</span>
                    <strong>{{
                      formatCurrency(parseFloat(offeringData.shippingCost || 0))
                    }}</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Digit unik:</span>
                    <strong>{{ formatCurrency(parseFloat(offeringData.uniqueDigit || 0)) }}</strong>
                  </div>
                  <hr />
                  <div class="d-flex justify-content-between">
                    <span>Total:</span>
                    <strong>{{ formatCurrency(total) }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="generateOffering">
            Download Offering
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus,
textarea:focus {
  border-color: #d22c36;
}

.table input {
  min-width: 80px;
}
</style>
