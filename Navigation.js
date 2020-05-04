import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from './screens/Home';
// import useLinking from './navigation/useLinking';
// import { SafeAreaView } from 'react-native-safe-area-context';
import SearchDisplayScreen from './screens/SearchDisplay';
import LoginScreen from './screens/Login'
import SignupScreen from './screens/Signup'
import StoreDisplayScreen from './screens/StoreDisplay'
import AppointmentsScreen from './screens/Appointments';
import AccountScreen from './screens/Account'
import {connect} from 'react-redux'
import { Provider } from 'react-redux'
import store from './redux/store';
import {logout} from './redux/redux'
import { bindActionCreators } from 'redux';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      transitionConfig : () => ({
        transitionSpec: {
          duration: 0,
          timing: Animated.timing,
          easing: Easing.step0,
        },
      }),
    }}
    
    transparentCard={true}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="SearchDisplay" component={SearchDisplayScreen} />
    <Stack.Screen name="StoreDisplay" component={StoreDisplayScreen}/>
  </Stack.Navigator>
}

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      isLoadingComplete: false,
      initialNavigationState: null,
    }
 }

 async componentDidUpdate(prevProps, prevState){
  if (prevProps.user !== this.props.user) {
    this.setState({
      update: true
    })
  }
 }

 handleLogout(){
  this.props.logout();
 }

 async componentDidMount(){
  this.setState({
    isLoadingComplete: true
  })
 }
 
 render() {
    if (!this.state.isLoadingComplete) {
      return null;
    } else {
      let login;
      let signup;
      let appointments;
      let account;
      let logout;
      if(!(this.props.user == null) && !(Object.keys(this.props.user).length === 0 && this.props.user.constructor === Object)){
        console.log("WE HAVE A USER!")
        appointments = <Drawer.Screen name="Appointments" component={AppointmentsScreen}/>
        account = <Drawer.Screen name="Account" component={AccountScreen}/>
        // logout = <Drawer.Screen name="Logout" component={LogoutScreen}/>
      }
      else{
        console.log("NO USER!")
        login = <Drawer.Screen name="Login" component={LoginScreen} />
        signup = <Drawer.Screen name="Signup" component={SignupScreen} />
      }
      return (
        <Provider store={store}>
            <NavigationContainer ref={this.state.containerRef} initialState={this.state.initialNavigationState} backgroundColor={"transparent"}>
              <Drawer.Navigator initialRouteName="Home" drawerContent={props => {
                if(!(this.props.user == null) && !(Object.keys(this.props.user).length === 0 && this.props.user.constructor === Object)){
                  return (
                    <DrawerContentScrollView {...props}>
                      <DrawerItemList {...props} />
                      <DrawerItem label="Logout" onPress={() => this.handleLogout()} />
                    </DrawerContentScrollView>
                  )
                }
                else{
                  return (
                    <DrawerContentScrollView {...props}>
                      <DrawerItemList {...props} />
                    </DrawerContentScrollView>
                  )
                }
              }}>
                <Drawer.Screen name="Home" component={HomeStack} />
                {login}
                {signup}
                {appointments}
                {account}
                {/* {logout} */}
              </Drawer.Navigator>
            </NavigationContainer>
        </Provider>
      );
    }
  }
}

const mapStateToProps = (state) => {
   return {
       user: state.userReducer.user
   }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  logout: () => logout()
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);