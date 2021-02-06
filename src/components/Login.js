import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button, Container, Col, Row, Alert, Spinner } from 'react-bootstrap'

import { setActiveUser } from '../reducers/activeUserReducer'

import loginService from '../services/login'
import actionService from '../services/actions'

const Login = () => {
  const dispatch = useDispatch()
  const activeUser = useSelector(state => state.activeUser)

  const [isLoggingIn, setLoggingIn] = useState(false)
  const [showLoginFail, setShowLoginFail] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoggingIn(true)
    const username = event.target.elements.formUsername.value
    const password = event.target.elements.formPassword.value
    event.target.elements.formUsername.value = ''
    event.target.elements.formPassword.value = ''

    try {
      const credentials = { username, password }
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedTviitteriUser', JSON.stringify(user)
      )
      const actions = await actionService.getAll(user.token)
      dispatch(setActiveUser({ ...user, ...actions }))
    } catch (exception) {
      setLoggingIn(false)
      setShowLoginFail(true)
    }
  }

  if (activeUser.token) {
    return <Redirect to="/" />
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col></Col>

        <Col sm={9} md={6}>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <div className="d-flex justify-content-center">
              {!isLoggingIn &&
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              }

              {isLoggingIn &&
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
          <br />
          {showLoginFail &&
            <Alert variant="danger">
              Wrong username or password!
            </Alert>
          }
        </Col>

        <Col></Col>
      </Row>
    </Container>
  )
}

export default Login