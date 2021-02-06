import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/search'

const getSearchResults = async (queryString) => {
  const response = await axios.get(`${baseUrl}?q=${encodeURIComponent(queryString)}`)
  return response.data
}

const searchService = {
  getSearchResults
}

export default searchService