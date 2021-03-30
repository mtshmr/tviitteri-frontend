import React from 'react'
import { Image } from 'react-bootstrap'

const Avatar = ({ userId, size }) => {
  const avatarSrc = `${process.env.REACT_APP_SERVER_URL}/api/images/avatars/${userId}`

  return <Image src={avatarSrc} width={size} height={size} roundedCircle />
}

export default Avatar