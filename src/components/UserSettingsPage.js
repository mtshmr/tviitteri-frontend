import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Form, Button, Accordion, Card, Alert, Spinner } from 'react-bootstrap'

import userService from '../services/users'
import uploadService from '../services/upload'

const UserSettingsPage = () => {
  const activeUser = useSelector(state => state.activeUser)

  const [isChanging, setChanging] = useState(false)
  const [changeFailed, setChangeFailed] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])

  const handlePasswordChanging = async (event) => {
    event.preventDefault()
    setChanging(true)
    const oldPassword = event.target.elements.formOldPassword.value
    const newPassword = event.target.elements.formNewPassword.value
    const newPasswordVerify = event.target.elements.formNewPasswordVerify.value
    event.target.elements.formOldPassword.value = ''
    event.target.elements.formNewPassword.value = ''
    event.target.elements.formNewPasswordVerify.value = ''
    if (newPassword === newPasswordVerify) {
      try {
        const userModInfo = { oldPassword, newPassword }
        await userService.modifyUserInfo(userModInfo, activeUser.userId, activeUser.token)
        setChangeFailed(null)
        setChanging(false)
      } catch (exception) {
        const response = exception.response
        const errorReason = response ? response.data.error : null
        const statusCode = response ? response.status : null
        setChangeFailed({ error: true, statusCode, errorReason })
        setChanging(false)
      }
    } else {
      const errorReason = 'new password fields are not equal'
      const statusCode = 400
      setChangeFailed({ error: true, statusCode, errorReason })
      setChanging(false)
    }
  }

  const handleNameChanging = async (event) => {
    event.preventDefault()
    setChanging(true)
    const newName = event.target.elements.formNewName.value
    event.target.elements.formNewName.value = ''
    try {
      const userModInfo = { name: newName }
      await userService.modifyUserInfo(userModInfo, activeUser.userId, activeUser.token)
      setChangeFailed(null)
      setChanging(false)
    } catch (exception) {
      const response = exception.response
      const errorReason = response ? response.data.error : null
      const statusCode = response ? response.status : null
      setChangeFailed({ error: true, statusCode, errorReason })
      setChanging(false)
    }
  }

  const handleBioChanging = async (event) => {
    event.preventDefault()
    setChanging(true)
    const newBio = event.target.elements.formNewBio.value
    event.target.elements.formNewBio.value = ''
    try {
      const userModInfo = { bio: newBio }
      await userService.modifyUserInfo(userModInfo, activeUser.userId, activeUser.token)
      setChangeFailed(null)
      setChanging(false)
    } catch (exception) {
      const response = exception.response
      const errorReason = response ? response.data.error : null
      const statusCode = response ? response.status : null
      setChangeFailed({ error: true, statusCode, errorReason })
      setChanging(false)
    }
  }

  const handleAvatarChanging = async (event) => {
    event.preventDefault()
    setChanging(true)
    const newAvatar = selectedFiles[0]
    try {
      await uploadService.postAvatar(newAvatar, activeUser.token)
      setChangeFailed(null)
      setChanging(false)
    } catch (exception) {
      const response = exception.response
      const errorReason = response ? response.data.error : null
      const statusCode = response ? response.status : null
      setChangeFailed({ error: true, statusCode, errorReason })
      setChanging(false)
    }
  }

  if (!activeUser.token) {
    return <Redirect to="/" />
  }

  return (
    <>
      <h2>Settings</h2>
      {changeFailed && <>
        <Alert variant="danger">
          ErrorReason: {changeFailed.errorReason} (StatusCode: {changeFailed.statusCode})
        </Alert>
        < br />
      </>
      }

      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Change name
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>

              <Form onSubmit={handleNameChanging}>
                <Form.Group controlId="formNewName">
                  <Form.Label>New name</Form.Label>
                  <Form.Control type="text" placeholder="New name" />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  {!isChanging &&
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  }

                  {isChanging &&
                    <Button variant="primary" disabled>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </Button>
                  }
                </div>
              </Form>

            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Change bio
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>

              <Form onSubmit={handleBioChanging}>
                <Form.Group controlId="formNewBio">
                  <Form.Label>New bio</Form.Label>
                  <Form.Control type="text" placeholder="New bio" />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  {!isChanging &&
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  }

                  {isChanging &&
                    <Button variant="primary" disabled>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </Button>
                  }
                </div>
              </Form>

            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="2">
              Change password
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="2">
            <Card.Body>

              <Form onSubmit={handlePasswordChanging}>
                <Form.Group controlId="formOldPassword">
                  <Form.Label>Current password</Form.Label>
                  <Form.Control type="password" placeholder="Current password" />
                </Form.Group>

                <Form.Group controlId="formNewPassword">
                  <Form.Label>New password</Form.Label>
                  <Form.Control type="password" placeholder="New password" />
                </Form.Group>

                <Form.Group controlId="formNewPasswordVerify">
                  <Form.Label>New password again</Form.Label>
                  <Form.Control type="password" placeholder="New password again" />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  {!isChanging &&
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  }

                  {isChanging &&
                    <Button variant="primary" disabled>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </Button>
                  }
                </div>
              </Form>

            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="3">
              Change avatar
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="3">
            <Card.Body>

              <Form encType='multipart/form-data' onSubmit={handleAvatarChanging}>
                <Form.Group controlId="formNewAvatar">
                  <Form.File
                    id="avatar"
                    label="New avatar"
                    onChange={e => {
                      setSelectedFiles(e.target.files)
                    }}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  {!isChanging &&
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  }

                  {isChanging &&
                    <Button variant="primary" disabled>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </Button>
                  }
                </div>
              </Form>

            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  )
}

export default UserSettingsPage