import axios from 'axios'

// Function to fetch data from API with server-side operations
export const mockServerItems = async (options) => {
  const {
    page = 1,
    rowsPerPage = 10,
    sortBy = 'name',
    sortType = 'desc',
    searchTerm = '',
  } = options

  try {
    const response = await axios.get('stocks-device', {
      params: {
        page,
        rowsPerPage,
        sortBy,
        sortType,
        searchTerm,
      },
    })

    let data = response.data.data

    if (sortBy === 'name') {
      // Natural sort algorithm for alphanumeric values
      data = [...data].sort((a, b) => {
        // Extract numeric parts for comparison
        const splitA = a.name.split(/(\d+)/).filter(Boolean)
        const splitB = b.name.split(/(\d+)/).filter(Boolean)

        const maxLength = Math.max(splitA.length, splitB.length)

        for (let i = 0; i < maxLength; i++) {
          if (splitA[i] === undefined) return -1
          if (splitB[i] === undefined) return 1

          // If both parts are numeric, compare as numbers
          if (!isNaN(splitA[i]) && !isNaN(splitB[i])) {
            const diff = parseInt(splitA[i]) - parseInt(splitB[i])
            if (diff !== 0) return sortType === 'asc' ? diff : -diff
          }
          // Otherwise compare as strings
          else {
            const compare = splitA[i].localeCompare(splitB[i])
            if (compare !== 0) return sortType === 'asc' ? compare : -compare
          }
        }

        return 0
      })
    }

    return {
      serverCurrentPageItems: data,
      serverTotalItemsLength: response.data.total,
    }
  } catch (error) {
    console.error('Error fetching stocks device:', error)
    throw error
  }
}
