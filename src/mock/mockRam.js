import axios from 'axios'

let cachedData = null

// Helper function to sort data
const sortData = (data, sortBy, sortType) => {
  return [...data].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortType === 'asc' ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortType === 'asc' ? 1 : -1
    return 0
  })
}

// Helper function to filter data
const filterData = (data, searchTerm) => {
  if (!searchTerm) return data
  return data.filter((item) =>
    Object.entries(item).some(([key, value]) => {
      // Skip id field and null/undefined values
      if (key === 'id' || value == null) return false
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    }),
  )
}

// Function to fetch data from API
const fetchDataFromAPI = async () => {
  try {
    const response = await axios.get('ram')
    return response.data.data
  } catch (error) {
    console.error('Data not found', error)
    throw error
  }
}

// Mock server-side operations
export const mockServerItems = async (options, token) => {
  const { page, rowsPerPage, sortBy, sortType, searchTerm } = options

  // Fetch data from API if not cached
  if (!cachedData) {
    cachedData = await fetchDataFromAPI(token)
  }

  let filteredData = filterData(cachedData, searchTerm)
  let sortedData = sortData(filteredData, sortBy, sortType)

  const totalItems = sortedData.length
  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  return {
    serverCurrentPageItems: paginatedData,
    serverTotalItemsLength: totalItems,
  }
}

// Function to refresh the cached data
export const refreshData = () => {
  cachedData = null
}
