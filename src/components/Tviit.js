import React from 'react'
import { useSelector } from 'react-redux'
import { Card, Container, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import DeleteTviitModalButton from './DeleteTviitModalButton'
import LikeTviitButton from './LikeTviitButton'
import Avatar from './Avatar'

const Tviit = ({ tviit }) => {

  const activeUser = useSelector(state => state.activeUser)

  return (
    <>
      <Card>
        <Card.Header >
          <div className="d-flex justify-content-between">

            <Container fluid>
              <Row className="d-flex align-items-center">
                <Col xs="auto" className="pl-0 pr-2">
                  <Avatar userId={tviit.userId} size={48} />
                </Col>
                <Col>
                  <Row><strong>{tviit.name}</strong></Row>
                  <Row>
                    <LinkContainer to={`/u/${tviit.username}`}>
                      <Card.Link>@{tviit.username}</Card.Link>
                    </LinkContainer>
                  </Row>
                </Col>
              </Row>
            </Container>

            <div className="d-flex align-items-center">
              {tviit.username !== activeUser.username &&
                <LikeTviitButton tviitId={tviit.id} likes={tviit.likes} />
              }
              {tviit.username === activeUser.username &&
                <DeleteTviitModalButton tviitId={tviit.id} />
              }
            </div>

          </div>
        </Card.Header>

        <Card.Body>
          <Card.Text>{tviit.content}</Card.Text>
        </Card.Body>

        <Card.Footer>
          <small className="text-muted">Posted {new Date(tviit.postDate).toString()}</small>
        </Card.Footer>
      </Card>
      <br />
    </>
  )
}

// TVIIT EXAMPLE STRUC
// {
//   username: "testaaja",
//   name: "Testi Testailija",
//   id: 5,
//   author: 1,
//   content: "Miten tämä toimii",
//   postDate: "2020-12-13T18:48:14.406Z",
//   responseTo: null
// }

export default Tviit