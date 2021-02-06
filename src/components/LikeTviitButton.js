import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Star, StarFill } from 'react-bootstrap-icons'

import actionService from '../services/actions'

import { likeTviit, unlikeTviit } from '../reducers/activeUserReducer'

const LikeTviitButton = ({ tviitId, likes }) => {
  const dispatch = useDispatch()
  const activeUser = useSelector(state => state.activeUser)

  const handleLikeTviit = async () => {
    try {
      const action = { actionType: 'like', targetTviitId: tviitId }
      await actionService.postAction(action, activeUser.token)
      dispatch(likeTviit(tviitId))
    } catch (exception) {
      // TODO
      console.log('Tviit liking failed!')
    }
  }

  const handleUnlikeTviit = async () => {
    try {
      const action = { actionType: 'like', targetTviitId: tviitId }
      await actionService.deleteAction(action, activeUser.token)
      dispatch(unlikeTviit(tviitId))
    } catch (exception) {
      // TODO
      console.log('Tviit unliking failed!')
    }
  }

  const margin = {
    marginTop: '3px'
  }

  if (!activeUser.token) {
    return (
      <Button variant="primary" disabled>
        <div className="d-flex justify-content-center">
          <StarFill className="mr-1" style={margin} /> {likes}
        </div>
      </Button>
    )
  }

  if (activeUser.actions.likes.includes(tviitId)) {
    return (
      <Button variant="primary" onClick={handleUnlikeTviit}>
        <div className="d-flex justify-content-center">
          <StarFill className="mr-1" style={margin} /> {likes}
        </div>
      </Button>
    )
  } else {
    return (
      <Button variant="primary" onClick={handleLikeTviit}>
        <div className="d-flex justify-content-center">
          <Star className="mr-1" style={margin} />{likes}
        </div>
      </Button>
    )
  }
}

export default LikeTviitButton