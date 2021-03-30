import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/api/login`

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const loginService = {
  login
}

export default loginService