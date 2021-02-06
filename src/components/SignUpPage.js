import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button, Container, Col, Row, Alert, Spinner } from 'react-bootstrap'

import loginService from '../services/login'
import userService from '../services/users'

import { setActiveUser } from '../reducers/activeUserReducer'

const SignUpPage = () => {
  const dispatch = useDispatch()
  const activeUser = useSelector(state => state.activeUser)

  const [isSigningUp, setSigningUp] = useState(false)
  const [signUpFailed, setSignUpFailed] = useState(null)

  const handleSignUp = async (event) => {
    event.preventDefault()
    setSigningUp(true)
    const username = event.target.elements.formUsername.value
    const name = event.target.elements.formName.value
    const password = event.target.elements.formPassword.value
    const passwordVerify = event.target.elements.formPasswordVerify.value
    // event.target.elements.formUsername.value = ''
    // event.target.elements.formName.value = ''
    // event.target.elements.formPassword.value = ''
    // event.target.elements.formPassword.value = ''

    if (password !== passwordVerify) {
      setSignUpFailed({ error: true, statusCode: 400, errorReason: 'password fields don\'t match' })
      setSigningUp(false)
    } else {
      try {
        const userInfo = { username, name, password }
        const createdUser = await userService.signUp(userInfo)
        const credentials = { username: createdUser.username, password }
        const user = await loginService.login(credentials)
        window.localStorage.setItem(
          'loggedTviitteriUser', JSON.stringify(user)
        )
        dispatch(setActiveUser(user))
      } catch (exception) {
        const response = exception.response
        const errorReason = response ? response.data.error : null
        const statusCode = response ? response.status : null
        setSignUpFailed({ error: true, statusCode, errorReason })
        setSigningUp(false)
      }
    }
  }

  if (activeUser.token) {
    return <Redirect to={`/u/${activeUser.username}`} />
  }

  return (
    <Container>
      <Row>
        <Col></Col>

        <Col sm={9} md={6}>
          <Form onSubmit={handleSignUp}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" />
            </Form.Group>

            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group controlId="formPasswordVerify">
              <Form.Label>Password again</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <div className="d-flex justify-content-center">
              {!isSigningUp &&
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              }

              {isSigningUp &&
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
          {signUpFailed &&
            <Alert variant="danger">
              Error while signing up, ErrorReason: {signUpFailed.errorReason} (StatusCode: {signUpFailed.statusCode})
            </Alert>
          }
        </Col>

        <Col></Col>
      </Row>
    </Container>
  )
}

export default SignUpPage