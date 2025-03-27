<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { showToast } from '@/utilities/toast'
import { cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-vue'
import logoDariVisi from '@/assets/images/darivisi.png'

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['download', 'back'])

// Logo handling
const logoUrl = ref(logoDariVisi)
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
  items: [
    {
      description: '',
      quantity: 1,
      dpp: 0,
      ppn: 0,
      price: 0,
      total: 0,
    },
  ],
  shippingCost: 0,
  uniqueDigit: 0,
  offeringDate: formatDate(new Date()),
})

// Computed properties for calculations
const subtotal = computed(() => {
  return offeringData.value.items.reduce((sum, item) => sum + item.total, 0)
})

const calculateDPPAndPPN = () => {
  offeringData.value.items.forEach((item) => {
    // Calculate DPP
    item.dpp = item.price / 1.11

    // Calculate PPN
    item.ppn = item.price * 0.099099
  })
}

const dpp = computed(() => {
  return subtotal.value / 1.11
})

const ppn = computed(() => {
  return subtotal.value * 0.099099
})

const total = computed(() => {
  return (
    subtotal.value +
    parseFloat(offeringData.value.shippingCost || 0) +
    parseFloat(offeringData.value.uniqueDigit || 0)
  )
})

// Methods
const calculateItemTotal = (index) => {
  const item = offeringData.value.items[index]
  item.total = item.quantity * item.price
  calculateDPPAndPPN()
}

const addItem = () => {
  offeringData.value.items.push({
    description: '',
    quantity: 1,
    dpp: 0,
    ppn: 0,
    price: 0,
    total: 0,
  })
}

const removeItem = (index) => {
  offeringData.value.items.splice(index, 1)
  calculateDPPAndPPN()
}

const calculateTotals = () => {
  // This function is called when shipping cost or unique digit changes
  // The subtotal, ppn, and total are computed properties
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

//  Method to generate a random 3-digit number
const generateRandomUniqueDigit = () => {
  return Math.floor(Math.random() * 900) + 100
}

// Generate PDF on the client side
const generateOffering = () => {
  try {
    calculateDPPAndPPN()
    // Generate PPM number
    const today = new Date()
    const year = today.getFullYear().toString().substring(2)
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const day = today.getDate().toString().padStart(2, '0')
    const uniqueNumber = offeringData.value.uniqueDigit
    const customer = offeringData.value.customerName
    const serialNumber = offeringData.value.serialNumber

    const ppaNumber = `PPM-${day}${month}${year}-${uniqueNumber}`
    const nameFile = `PPM-${day}${month}${year}-${uniqueNumber}_${customer}_${serialNumber}`
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
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Penawaran Perbaikan', 195, 25, { align: 'right' })

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
      head: [['#', 'Item & Deskripsi', 'Jml', 'DPP', 'PPN 11 %', 'Tarif', 'Jumlah']],
      body: offeringData.value.items.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        formatCurrency(item.dpp),
        formatCurrency(item.ppn),
        formatCurrency(item.price),
        formatCurrency(item.total),
      ]),
      foot: [
        ['', '', '', '', '', 'Sub Total', formatCurrency(subtotal.value)],
        [
          '',
          '',
          '',
          '',
          '',
          'Biaya Pengiriman',
          formatCurrency(parseFloat(offeringData.value.shippingCost || 0)),
        ],
        [
          '',
          '',
          '',
          '',
          '',
          'Digit unik',
          formatCurrency(parseFloat(offeringData.value.uniqueDigit || 0)),
        ],
        [
          '',
          '',
          '',
          '',
          '',
          {
            content: 'Total',
            styles: {
              fontStyle: 'bold',
              fillColor: [240, 240, 240],
              textColor: [0, 0, 0],
            },
          },
          {
            content: `IDR${formatCurrency(total.value)}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [240, 240, 240],
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60], halign: 'center' },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        halign: 'right',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 30, halign: 'center' },
        4: { cellWidth: 'auto', halign: 'center' },
        5: { cellWidth: 'auto', halign: 'center' },
        6: { cellWidth: 'auto', halign: 'center' },
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
    })
    // note transfer
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(8)
    doc.text('*Pastikan jumlah transfer sesuai dengan invoice', 195, finalY, { align: 'right' })
    doc.text('termasuk 3 digit unik terakhir', 195, finalY + 4, { align: 'right' })

    // Add note before new page
    doc.setFontSize(8)
    doc.text(
      'Catatan : Batas waktu permintaan untuk penerbitan faktur pajak 3 hari dari tanggal Invoice.',
      15,
      doc.internal.pageSize.height - 15, // Position at the bottom of the page with some margin
    )

    // Add a new page for Terms and Conditions
    doc.addPage()

    // Title for Terms and Conditions
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Ketentuan Layanan Perbaikan :', 20, 30)

    // 1. Service Timeframe Section
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('1. Waktu Pengerjaan:', 20, 45)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Waktu pengerjaan perbaikan adalah maksimal 4 (empat) hari kerja, tidak termasuk waktu pengiriman.',
      25,
      52,
    )
    doc.text('• Waktu pengerjaan dihitung sejak perangkat diterima di Service Center kami.', 25, 59)
    doc.text(
      '• Pengerjaan unit di luar garansi akan dilakukan setelah pembayaran diterima.',
      25,
      66,
    )

    // 2. Service Warranty Section
    doc.setFont('helvetica', 'bold')
    doc.text('2. Garansi Layanan:', 20, 78)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Untuk layanan perbaikan tanpa penggantian suku cadang, diberikan garansi selama 1 (satu) bulan.',
      25,
      85,
    )
    doc.text(
      '• Untuk layanan perbaikan dengan penggantian suku cadang, diberikan garansi selama 3 (tiga) bulan.',
      25,
      92,
    )
    doc.text(
      '• Garansi mencakup perbaikan ulang terhadap masalah yang sama yang terjadi selama masa garansi.',
      25,
      99,
    )

    // 3. Inspection Fee Section
    doc.setFont('helvetica', 'bold')
    doc.text('3. Biaya Pemeriksaan:', 20, 111)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Pelanggan akan dikenakan biaya pemeriksaan sebesar Rp50.000 (lima puluh ribu rupiah).',
      25,
      118,
    )
    doc.text('  Biaya pemeriksaan dikenakan dalam kondisi berikut:', 25, 125)
    doc.text(
      '    - Pelanggan tidak menyetujui saran perbaikan yang diberikan oleh teknisi.',
      25,
      132,
    )
    doc.text(
      '    - Setelah pemeriksaan, tidak ditemukan kerusakan pada perangkat yang dikirimkan.',
      25,
      139,
    )

    // 4. Other Terms Section
    doc.setFont('helvetica', 'bold')
    doc.text('4. Ketentuan Lain', 20, 151)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Service Center berhak menolak perbaikan, jika perangkat yang di terima, tidak sesuai dengan standar',
      25,
      158,
    )
    doc.text('  operasional perusahaan.', 25, 165)
    doc.text(
      '• Pelanggan wajib memberikan informasi yang benar, dan lengkap terkait kerusakan perangkat.',
      25,
      172,
    )
    doc.text(
      '• Service Center tidak bertanggung jawab atas kehilangan data, yang terjadi selama proses perbaikan.',
      25,
      179,
    )
    doc.text(
      '• Biaya pengiriman perangkat ke Service Center, dan pengiriman perangkat kembali ke pelanggan, di',
      25,
      186,
    )
    doc.text('  tanggung oleh pelanggan.', 25, 193)
    doc.text(
      '• Apabila unit selesai atau batal servis tidak diambil lebih dari 3 (tiga) bulan kalender sejak diterima di',
      25,
      200,
    )
    doc.text(
      '  Service Center, berhak melakukan proses daur ulang (recycle) dan unit tidak dapat diambil kembali.',
      25,
      207,
    )

    // Notes Section
    doc.setFont('helvetica', 'bold')
    doc.text('Catatan:', 20, 220)
    doc.setFont('helvetica', 'normal')
    doc.text(
      '• Syarat dan ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.',
      25,
      227,
    )
    doc.text(
      '• Dengan menggunakan layanan kami, pelanggan dianggap telah membaca dan menyetujui syarat dan',
      25,
      234,
    )
    doc.text('  ketentuan ini.', 25, 241)

    // Save the PDF
    doc.save(`${nameFile}.pdf`)

    // Create offering data object with combined damage and repair descriptions
    const offeringForDownload = {
      ...offeringData.value,
      damageDescription: `Kerusakan: ${offeringData.value.damage}\nPerbaikan: ${offeringData.value.repair}`,
      ppaNumber,
      date: formatDate(today),
      subtotal: subtotal.value,
      dpp: dpp.value,
      ppn: ppn.value,
      total: total.value,
    }

    showToast('Quotation downloaded successfully', 'success')
    emit('download', offeringForDownload)
  } catch (error) {
    console.error('Error generating quotation:', error)
  }
}

// Watch for changes in props
watch(
  () => props.service,
  (newValue) => {
    if (newValue) {
      // Populate form with service data as initial values
      offeringData.value.customerName = newValue.customers || ''
      offeringData.value.serialNumber = newValue.serial_number || ''
      offeringData.value.address = newValue.address || ''
      offeringData.value.damage = newValue.damage || ''
      offeringData.value.repair = newValue.repair || ''

      // Reset items
      offeringData.value.items = [
        {
          description: '',
          quantity: 1,
          dpp: 0,
          ppn: 0,
          price: 0,
          total: 0,
        },
      ]
      offeringData.value.shippingCost = 0

      // Always use a random unique digit
      offeringData.value.uniqueDigit = generateRandomUniqueDigit()
    }
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  offeringData.value.uniqueDigit = generateRandomUniqueDigit()
})
</script>

<template>
  <div class="container-fluid py-4">
    <div class="card">
      <div
        class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">Generate Quotation</h5>
      </div>
      <div class="card-body">
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="customerName" class="form-label fw-bold">Customer</label>
              <input
                type="text"
                class="form-control shadow-none"
                id="customerName"
                v-model="offeringData.customerName"
                placeholder="Enter customer name"
              />
            </div>
            <div class="form-group">
              <label for="serialNumber" class="form-label fw-bold">Serial Number</label>
              <input
                type="text"
                class="form-control shadow-none"
                id="serialNumber"
                v-model="offeringData.serialNumber"
                placeholder="Enter serial number"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="address" class="form-label fw-bold">Address</label>
              <textarea
                class="form-control shadow-none"
                id="address"
                v-model="offeringData.address"
                rows="2"
                placeholder="Enter customer address"
              ></textarea>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="damage" class="form-label fw-bold">Damage</label>
                  <textarea
                    class="form-control shadow-none"
                    id="damage"
                    v-model="offeringData.damage"
                    rows="2"
                    placeholder="Enter damage description"
                  ></textarea>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="repair" class="form-label fw-bold">Repair</label>
                  <textarea
                    class="form-control shadow-none"
                    id="repair"
                    v-model="offeringData.repair"
                    rows="2"
                    placeholder="Enter repair description"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h5 class="mb-3 border-bottom pb-2">Items</h5>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead class="bg-light">
              <tr>
                <th width="50" class="text-center">#</th>
                <th>Item & Deskripsi</th>
                <th width="80" class="text-center">Jml</th>
                <th width="120" class="text-center">DPP</th>
                <th width="120" class="text-center">PPN 11%</th>
                <th width="120" class="text-center">Tarif</th>
                <th width="120" class="text-center">Jumlah</th>
                <th width="80" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in offeringData.items" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  <input
                    type="text"
                    class="form-control shadow-none"
                    v-model="item.description"
                    placeholder="Enter item description"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control shadow-none text-center"
                    v-model="item.quantity"
                    @input="calculateItemTotal(index)"
                    min="1"
                  />
                </td>
                <td class="text-end">{{ formatCurrency(item.dpp) }}</td>

                <td class="text-end">{{ formatCurrency(item.ppn) }}</td>
                <td>
                  <input
                    type="number"
                    class="form-control shadow-none text-end"
                    v-model="item.price"
                    @input="calculateItemTotal(index)"
                  />
                </td>
                <td class="text-end">{{ formatCurrency(item.total) }}</td>
                <td class="text-center">
                  <button
                    v-if="index > 0"
                    class="btn btn-sm btn-danger"
                    @click="removeItem(index)"
                    title="Remove item"
                  >
                    <CIcon :icon="cilTrash" class="text-white" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="py-2">
                  <button class="btn btn-sm btn-danger text-white" @click="addItem">
                    <CIcon :icon="cilPlus" class="text-white" /> Add Item
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="row mt-4">
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">Additional Costs</h6>
              </div>
              <div class="card-body">
                <div class="form-group mb-3">
                  <label for="shippingCost" class="form-label">Biaya Pengiriman</label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input
                      type="number"
                      class="form-control shadow-none"
                      id="shippingCost"
                      v-model="offeringData.shippingCost"
                      @input="calculateTotals"
                    />
                  </div>
                </div>
                <div class="form-group" hidden>
                  <label for="uniqueDigit" class="form-label">Digit Unik</label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input
                      type="number"
                      class="form-control shadow-none"
                      id="uniqueDigit"
                      min="100"
                      max="999"
                      v-model="offeringData.uniqueDigit"
                      @input="calculateTotals"
                      readonly
                    />
                  </div>
                  <small class="text-muted">Angka unik untuk identifikasi pembayaran</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">Summary</h6>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Sub Total:</span>
                  <strong>{{ formatCurrency(subtotal) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Biaya Pengiriman:</span>
                  <strong>{{ formatCurrency(parseFloat(offeringData.shippingCost || 0)) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Digit unik:</span>
                  <strong>{{ formatCurrency(parseFloat(offeringData.uniqueDigit || 0)) }}</strong>
                </div>
                <hr class="my-2" />
                <div class="d-flex justify-content-between">
                  <span class="fw-bold">Total:</span>
                  <strong class="text-primary">IDR {{ formatCurrency(total) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
          <button type="button" class="btn btn-primary" @click="generateOffering">
            Download Quotation
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

.table th {
  font-weight: 600;
}

.card-header h5 {
  font-weight: 600;
}

.form-label {
  font-weight: 500;
}
</style>
