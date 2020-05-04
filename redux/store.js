import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers/index';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native'

 async function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state)
    await AsyncStorage.setItem('state', serializedState)
    // localStorage.setItem('state', serializedState)
  } catch (e) {
    console.log(e)
  }
}

 async function loadFromLocalStorage() {
  try {
    const serializedState = await AsyncStorage.getItem('state')
    // const serializedState = localStorage.getItem('state')
    console.log("!!!!!!!!!!!", serializedState)
    if(serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (e) {
    console.log(e)
    return undefined
  }
}

// const persistedState = loadFromLocalStorage()

const store = createStore(
  reducers,
  undefined,
  applyMiddleware(thunk)
)

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store;