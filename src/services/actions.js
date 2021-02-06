import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/actions'

const getAll = async (token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const postAction = async (action, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.post(baseUrl, action, config)
  return response.data
}

const deleteAction = async (action, token) => {
  const config = {
    data: action,
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.delete(baseUrl, config)
  return response.data
}

const actionService = {
  getAll,
  postAction,
  deleteAction
}

export default actionService