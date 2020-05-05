import 'react-native-gesture-handler';
import * as React from 'react';
import Navigation from './Navigation'
import { Provider } from 'react-redux'
import store from './redux/store';

export default function App(){
  return <Provider store={store}>
          <Navigation/>
        </Provider>
}