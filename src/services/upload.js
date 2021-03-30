import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/api/upload`

const postAvatar = async (avatarFile, token) => {
  let formData = new FormData()
  formData.append('avatar', avatarFile)
  const config = {
    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `bearer ${token}` }
  }

  const response = await axios.post(`${baseUrl}/avatar`, formData, config)
  return response.data
}

const uploadService = {
  postAvatar
}

export default uploadService