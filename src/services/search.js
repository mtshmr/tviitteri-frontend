import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/api/search`

const getSearchResults = async (queryString) => {
  const response = await axios.get(`${baseUrl}?q=${encodeURIComponent(queryString)}`)
  return response.data
}

const searchService = {
  getSearchResults
}

export default searchService