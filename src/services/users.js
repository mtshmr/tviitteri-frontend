import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/users'

const getUser = async (username, offset = 0) => {
  const response = await axios.get(`${baseUrl}?username=${username}&getTviits=true&offset=${offset}`)
  return response.data
}

const signUp = async (userInfo) => {
  const response = await axios.post(baseUrl, userInfo)
  return response.data
}

const modifyUserInfo = async (userInfo, userId, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.patch(`${baseUrl}/${userId}`, userInfo, config)
  return response.data
}

const userService = {
  getUser,
  signUp,
  modifyUserInfo
}

export default userService