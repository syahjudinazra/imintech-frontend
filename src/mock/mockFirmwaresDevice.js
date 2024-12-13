import axios from 'axios'

// Function to fetch data from API with server-side operations
export const mockServerItems = async (options) => {
  const { page = 1, rowsPerPage = 10, sortBy = 'id', sortType = 'asc', searchTerm = '' } = options

  try {
    const response = await axios.get('firmwares-device', {
      params: {
        page,
        rowsPerPage,
        sortBy,
        sortType,
        searchTerm,
      },
    })

    return {
      serverCurrentPageItems: response.data.data,
      serverTotalItemsLength: response.data.total,
    }
  } catch (error) {
    console.error('Error fetching firmwares device:', error)
    throw error
  }
}
