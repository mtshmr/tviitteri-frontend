import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/api/tviits`

const getAll = async (offset = 0) => {
  const response = await axios.get(`${baseUrl}?offset=${offset}`)
  return response.data
}

const postTviit = async (tviit, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.post(baseUrl, tviit, config)
  return response.data
}

const deleteTviit = async (tviitId, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.delete(`${baseUrl}/${tviitId}`, config)
  return response.data
}

const tviitService = {
  getAll,
  postTviit,
  deleteTviit
}

export default tviitService