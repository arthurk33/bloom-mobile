export const ADD_USER = 'ADD_USER'
export const REMOVE_USER = 'REMOVE_USER'

export function addUser(userPassed) {
  return {
    type: ADD_USER,
    user: userPassed
  }
}

export function removeUser() {
  return {
    type: ADD_USER
  }
}

