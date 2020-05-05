import {addUser, removeUser} from './actions/user';

export function login(email, password) {
  return dispatch => {
    console.log("LOGGING IN!")
    fetch('http://192.168.1.24:8081/login' , {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: "POST",
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    })
    .then(function(response){
      if(response.status!==200){
        alert("Invalid email/password!");
        return null
      }
      else{
        return response.json()
      }
    })
    .then(data => {
      if(data){
        dispatch(addUser(data.user));
        return data;
      }
      else{
        return null
      }
    });
  }
}

export function logout() {
  return dispatch => {
    dispatch(removeUser());
  }
}