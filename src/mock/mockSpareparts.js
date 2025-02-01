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
  const filterParams = {}

  // Handle individual column filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.toString().trim() !== '') {
      filterParams[`filter[${key}]`] = value.toString().trim()
    }
  })

  try {
    const response = await axios.get('spareparts', {
      params: {
        page,
        rowsPerPage,
        sortBy,
        sortType,
        ...filterParams,
        search: searchTerm, // Add global search parameter if needed
      },
    })

    return {
      serverCurrentPageItems: response.data.data,
      serverTotalItemsLength: response.data.total,
    }
  } catch (error) {
    console.error('Error fetching spareparts:', error)
    throw error
  }
}
