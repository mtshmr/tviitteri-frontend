import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Spinner, Alert } from 'react-bootstrap'

import searchService from '../services/search'

import Tviit from './Tviit'

const SearchResults = () => {
  const queryString = new URLSearchParams(useLocation().search).get('q')
  const [searchResults, setSearchResults] = useState(null)

  useEffect(() => {
    const handleSearching = async () => {
      try {
        const tviits = await searchService.getSearchResults(queryString)
        setSearchResults(tviits)
      } catch (exception) {
        const response = exception.response
        const errorReason = response.data ? response.data.error : null
        const statusCode = response ? response.status : null
        setSearchResults({ error: true, statusCode, errorReason })
      }
    }
    handleSearching()
  }, [queryString])

  if (!searchResults) return (
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
    </div>
  )

  if (searchResults.error) {
    return (
      <Alert variant="danger">
        Error while fetching search results, ErrorReason: {searchResults.errorReason} (StatusCode: {searchResults.statusCode})
      </Alert>
    )
  }

  if (searchResults.length === 0) {
    return (
      <Alert variant="warning">
        No results found
      </Alert>
    )
  }

  return (
    <div>
      <h2>Search results:</h2>
      {searchResults.map(tviit =>
        <Tviit
          key={tviit.id}
          tviit={tviit}
        />
      )}
    </div>
  )
}

export default SearchResults