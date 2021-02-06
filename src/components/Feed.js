import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Spinner, Alert, Button } from 'react-bootstrap'

import tviitService from '../services/tviits'

import Tviit from './Tviit'

const Feed = () => {
  const activeUser = useSelector(state => state.activeUser)

  const [feed, setFeed] = useState(null)
  const [noMoreTviits, setNoMoreTviits] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const handleTviitGetting = async () => {
      try {
        const tviits = await tviitService.getAll()
        setFeed(tviits)
      } catch (exception) {
        const statusCode = exception.response ? exception.response.status : null
        setFeed({ error: true, statusCode })
      }
    }
    handleTviitGetting()
  }, [])

  const handleFetchMoreTviits = async () => {
    try {
      setIsSearching(true)
      const tviits = await tviitService.getAll(feed.length)
      if (tviits.length === 0) {
        setNoMoreTviits(true)
      } else {
        setFeed([...new Set(feed.concat(tviits))].sort((a, b) => b.id - a.id))
      }
      setIsSearching(false)
    } catch (exception) {
      // const statusCode = exception.response ? exception.response.status : null
      setIsSearching(false)
    }
  }

  if (!feed) return (
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
    </div>
  )

  if (feed.error) {
    return (
      <Alert variant="danger">
        Error while fetching feed (StatusCode: {feed.statusCode})
      </Alert>
    )
  }

  // If a tviit is deleted by the active user, check if it's in the feed and if it's, remove it
  if (activeUser.tviitDeleted &&
    feed.map(tviit => tviit.id).includes(activeUser.tviitDeleted)) {

    const filteredTviits = feed.filter(tviit => tviit.id !== activeUser.tviitDeleted)
    setFeed(filteredTviits)
  }

  return (
    <div>
      <h2>Newest:</h2>
      {feed.map(tviit =>
        <Tviit
          key={tviit.id}
          tviit={tviit}
        />
      )}

      <div className="d-flex justify-content-center">
        {(!noMoreTviits && !isSearching) &&
          <Button variant="primary"
            onClick={handleFetchMoreTviits}
            className="w-50">Get more tviits</Button>
        }
        {(!noMoreTviits && isSearching) &&
          <Button variant="primary" className="w-50" disabled block>
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
        {(noMoreTviits && !isSearching) &&
          <Button variant="primary"
            className="w-50"
            disabled block>Get more tviits</Button>
        }
      </div>
    </div>
  )
}

export default Feed