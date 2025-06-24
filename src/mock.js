import axios from 'axios'
import { showToast } from '@/utilities/toast'

export const mockClientItems = async function (itemsNumber = 100) {
  const mockItems = []
  const firmwares = await fetchFirmwares()

  const numItems = Math.min(itemsNumber, firmwares.length)

  for (let i = 1; i <= numItems; i++) {
    mockItems.push({
      tipe: firmwares[i % firmwares.length].tipe,
      versi: firmwares[i % firmwares.length].versi,
      android: firmwares[i % firmwares.length].android,
      flash: firmwares[i % firmwares.length].flash,
      ota: firmwares[i % firmwares.length].ota,
    })
  }
  return mockItems
}

async function fetchFirmwares() {
  try {
    const response = await axios.get(`getfirmwarestable`)
    return response.data.data
  } catch (error) {
    showToast('Failed to load firmwares data.', 'error')
    return []
  }
}

export const mockServerItems = async function (serverOptions) {
  const { page, rowsPerPage, sortBy, sortType } = serverOptions
  const serverTotalItems = await mockClientItems()

  if (sortBy && sortType) {
    serverTotalItems.sort(function (a, b) {
      if (a[sortBy] < b[sortBy]) return sortType === 'desc' ? 1 : -1
      if (a[sortBy] > b[sortBy]) return sortType === 'desc' ? -1 : 1
      return 0
    })
  }

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000)
  })

  const serverItemsLength = serverTotalItems.length
  const serverCurrentPageItems = serverTotalItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  )

  return {
    serverCurrentPageItems,
    serverTotalItemsLength: serverItemsLength,
  }
}
