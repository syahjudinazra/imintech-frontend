import axios from 'axios'

export const mockServerItems = async (options) => {
  const {
    page = 1,
    rowsPerPage = 10,
    sortBy = 'id',
    sortType = 'asc',
    filters = {},
    searchTerm = '',
  } = options

  // Create filter parameters
  const params = {
    page,
    rowsPerPage,
    sortBy,
    sortType,
    search: searchTerm,
  }

  // Add individual column filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.toString().trim() !== '') {
      params[`filter[${key}]`] = value.toString().trim()
    }
  })

  try {
    const response = await axios.get('spareparts', { params })

    return {
      serverCurrentPageItems: response.data.data,
      serverTotalItemsLength: response.data.total,
    }
  } catch (error) {
    console.error('Error fetching spareparts:', error)
    throw error
  }
}
