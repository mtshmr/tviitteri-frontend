import loginService from '../services/login'
import tviitService from '../services/tviits'

const activeUserReducer = (state = {}, action) => {
  switch (action.type) {
  case 'USER_LOGIN':
    return { ...action.data }
  case 'SET_ACTIVE_USER':
    return { ...action.data }
  case 'USER_DELETE_TVIIT':
    return { ...state, tviitDeleted: action.data.tviitId }
  case 'USER_LIKE_TVIIT': {
    const newLikes = state.actions.likes.concat(action.data.tviitId)
    return { ...state, actions: { likes: newLikes } }
  }
  case 'USER_UNLIKE_TVIIT': {
    const filteredLikes = state.actions.likes.filter(tviitId => tviitId !== action.data.tviitId)
    return { ...state, actions: { likes: filteredLikes } }
  }
  default:
    return state
  }
}

export const login = (username, password) => {
  return async dispatch => {
    try {
      const credentials = { username, password }
      const user = await loginService.login(credentials)
      dispatch({
        type: 'USER_LOGIN',
        data: {
          ...user
        }
      })
      window.localStorage.setItem(
        'loggedTviitteriUser', JSON.stringify(user)
      )
    } catch {
      dispatch({
        type: 'USER_LOGIN',
        data: {
          username,
          failed: true
        }
      })
    }
  }
}

export const setActiveUser = (user) => {
  return async dispatch => {
    dispatch({
      type: 'SET_ACTIVE_USER',
      data: {
        ...user
      }
    })
  }
}

export const setDeletedTviit = (tviitId) => {
  return async dispatch => {
    dispatch({
      type: 'USER_DELETE_TVIIT',
      data: {
        tviitId
      }
    })
  }
}

export const postTviit = (tviitToPost, token) => {
  return async dispatch => {
    try {
      const tviit = await tviitService.postTviit(tviitToPost, token)
      dispatch({
        type: 'USER_POST_TVIIT',
        data: {
          ...tviit
        }
      })
    } catch {
      dispatch({
        type: 'USER_POST_TVIIT_FAILED',
        data: {}
      })
    }
  }
}

export const likeTviit = (tviitId) => {
  return async dispatch => {
    dispatch({
      type: 'USER_LIKE_TVIIT',
      data: {
        tviitId
      }
    })
  }
}

export const unlikeTviit = (tviitId) => {
  return async dispatch => {
    dispatch({
      type: 'USER_UNLIKE_TVIIT',
      data: {
        tviitId
      }
    })
  }
}

export default activeUserReducer