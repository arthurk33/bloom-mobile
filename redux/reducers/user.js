import { ADD_USER, REMOVE_USER } from "../actions/user"

const initialState = {
  user: {},
}

function userReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_USER:
      return Object.assign({}, state, {
        user: action.user
      })

    case REMOVE_USER:
      return Object.assign({}, state, {
        user: {}
      })

    default:
      return state
  }
}

export default userReducer;
