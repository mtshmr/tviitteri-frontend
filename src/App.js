import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, useHistory, withRouter } from 'react-router-dom'
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button, Jumbotron } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { ChatQuoteFill } from 'react-bootstrap-icons'

import { setActiveUser } from './reducers/activeUserReducer'

import actionService from './services/actions'

import Feed from './components/Feed'
import Userpage from './components/Userpage'
import Login from './components/Login'
import SearchResults from './components/SearchResults'
import SignUpPage from './components/SignUpPage'
import UserSettingsPage from './components/UserSettingsPage'
import NotFound from './components/NotFound'

const App = () => {
  const dispatch = useDispatch()
  const activeUser = useSelector(state => state.activeUser)
  const history = useHistory()

  useEffect(() => {
    const handleCheckingLocalStorage = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedTviitteriUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        const actions = await actionService.getAll(user.token)
        dispatch(setActiveUser({ ...user, ...actions }))
      }
    }
    handleCheckingLocalStorage()
  }, [dispatch])

  const handleSearch = (event) => {
    event.preventDefault()
    const searchString = event.target.elements.formNavBarSearch.value
    event.target.elements.formNavBarSearch.value = ''

    if (searchString !== '') {
      history.push(`/search?q=${encodeURIComponent(searchString)}`)
    }
  }

  const handleSelect = (event) => {
    if (event === 'login') {
      history.push('/login')
    } else if (event === 'sign-up') {
      history.push('/sign-up')
    } else if (event === 'my-page') {
      history.push(`/u/${activeUser.username}`)
    }else if (event === 'settings') {
      history.push('/settings')
    } else if (event === 'logout') {
      dispatch(setActiveUser({}))
      window.localStorage.clear()
      history.push('/')
    }
  }

  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="primary" variant="dark">

        <LinkContainer to="/">
          <ChatQuoteFill className="align-top" size={40} color="#f8f9fa" />
        </LinkContainer>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">

            <LinkContainer to="/">
              <Nav.Link href="#">Home</Nav.Link>
            </LinkContainer>

          </Nav>

          <Nav>
            {!activeUser.token &&
              <NavDropdown onSelect={handleSelect} title={'Login / Sign up'} id="basic-nav-dropdown">
                <NavDropdown.Item eventKey="login">Login</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="sign-up">Sign up</NavDropdown.Item>
              </NavDropdown>
            }

            {activeUser.token &&
              <NavDropdown onSelect={handleSelect} title={`@${activeUser.username}`} id="basic-nav-dropdown">
                <NavDropdown.Item eventKey="my-page">My page</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="logout">Logout</NavDropdown.Item>
              </NavDropdown>
            }
          </Nav>

          <Form inline onSubmit={handleSearch}>
            <Form.Group controlId="formNavBarSearch">
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-light" type="submit">Search</Button>
            </Form.Group>
          </Form>
        </Navbar.Collapse>
      </Navbar>

      <Container>

        <br />

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/sign-up">
            <SignUpPage />
          </Route>
          <Route path="/u/:username">
            <Userpage />
          </Route>
          <Route path="/settings">
            <UserSettingsPage />
          </Route>
          <Route path="/search">
            <SearchResults />
          </Route>
          <Route exact path="/">
            <Jumbotron>
              <h1>Hello and welcome to Tviitteri!</h1>
              <p>
                Tviitteri is a simple microblog service built with React.js, Node.js, Express.js and it uses a SQLite database.
              </p>
            </Jumbotron>
            <hr />
            <Feed />
          </Route>
          <Route component={NotFound} />
        </Switch>

        <hr />
        <div className="text-center">
          <i>Tviitteri, {new Date().getFullYear()}</i>
        </div>

      </Container>
    </>
  )
}

export default withRouter(App)