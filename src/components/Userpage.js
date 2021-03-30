import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Spinner, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap'

import userService from '../services/users'
import tviitService from '../services/tviits'

import Tviit from './Tviit'
import Avatar from './Avatar'

const Userpage = () => {
  const username = useParams().username
  const activeUser = useSelector(state => state.activeUser)

  const [userpage, setUserpage] = useState(null)
  const [tviitingFailed, setTviitingFailed] = useState(null)

  useEffect(() => {
    const handleUserGetting = async () => {
      try {
        const user = await userService.getUser(username)
        setUserpage({ ...user })
      } catch (exception) {
        const statusCode = exception.response ? exception.response.status : null
        setUserpage({ error: true, statusCode })
      }
    }
    handleUserGetting()
  }, [username])

  if (!userpage) return (
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
    </div>
  )

  if (userpage.error) {
    if (userpage.statusCode === 404) {
      return (
        <Alert variant="warning">
          404, User not found
        </Alert>
      )
    } else {
      return (
        <Alert variant="danger">
          Error
        </Alert>
      )
    }
  }

  // If a tviit is deleted by the active user, check if it's in the userpage's tviits and if it's, remove it
  if (activeUser.username === username &&
    activeUser.tviitDeleted &&
    userpage.tviits.map(tviit => tviit.id).includes(activeUser.tviitDeleted)) {

    const filteredTviits = userpage.tviits.filter(tviit => tviit.id !== activeUser.tviitDeleted)
    setUserpage({ ...userpage, tviits: filteredTviits })
  }

  const handleTviiting = async (event) => {
    event.preventDefault()
    const content = event.target.elements.tviitingTextArea.value
    event.target.elements.tviitingTextArea.value = ''
    const tviitToPost = { content }

    if (content.length > 0) {
      try {
        const tviit = await tviitService.postTviit(tviitToPost, activeUser.token)
        const tviitToAdd = { ...tviit, username: activeUser.username, name: activeUser.name }
        const newUserpage = { ...userpage, tviits: [tviitToAdd].concat(userpage.tviits) }
        setUserpage(newUserpage)
        setTviitingFailed(null)
      } catch (exception) {
        const response = exception.response
        const errorReason = response ? response.data.error : null
        const statusCode = response ? response.status : null
        setTviitingFailed({ error: true, statusCode, errorReason })
      }
    }
  }

  const postTviitForm = () => {
    return (
      <div>
        <hr />
        <Form onSubmit={handleTviiting}>
          <Form.Group controlId="tviitingTextArea">
            <Form.Label>Tviit</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Post
          </Button>
        </Form>
      </div>
    )
  }

  return (
    <>
      <Container fluid>
        <Row className="d-flex align-items-center justify-content-between">
          <Col></Col>
          <Col xs="auto">
            <Row>
              <Col xs="auto" className="pl-0 pr-2">
                <Avatar userId={userpage.userId} size={72} />
              </Col>
              <Col xs="auto">
                <Row><strong><h4>{userpage.name}</h4></strong></Row>
                <Row><strong><h4>@{userpage.username}</h4></strong></Row>
              </Col>
            </Row>
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          <Col className="d-flex justify-content-center">
            <strong>
              <h4>
                <small className="text-muted">
                  {userpage.bio}
                </small>
              </h4>
            </strong>
          </Col>
        </Row>
      </Container>

      {activeUser.username === username &&
        postTviitForm()
      }
      {tviitingFailed && <>
        < br />
        <Alert variant="danger">
          Error while posting tviit, ErrorReason: {tviitingFailed.errorReason} (StatusCode: {tviitingFailed.statusCode})
        </Alert>
      </>
      }
      <hr />
      <div>
        <div>
          {userpage.tviits.map(tviit =>
            <Tviit
              key={tviit.id}
              tviit={tviit}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Userpage