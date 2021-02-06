import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { TrashFill } from 'react-bootstrap-icons'

import tviitService from '../services/tviits'

import { setDeletedTviit } from '../reducers/activeUserReducer'

const DeleteTviitModalButton = ({ tviitId }) => {
  const dispatch = useDispatch()
  const activeUser = useSelector(state => state.activeUser)

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleDeleteTviit = async () => {
    try {
      await tviitService.deleteTviit(tviitId, activeUser.token)
      dispatch(setDeletedTviit(tviitId))
      // setShow(false)
    } catch (exception) {
      // TODO
      console.log('Tviit deletion failed!')
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <TrashFill />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete tviit?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this tviit?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteTviit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteTviitModalButton