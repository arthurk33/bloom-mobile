import 'react-native-gesture-handler';
import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { SplashScreen } from 'expo';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// import BottomTabNavigator from './navigation/BottomTabNavigator';
import HomeScreen from './screens/Home';
import useLinking from './navigation/useLinking';
// import { SafeAreaView } from 'react-native-safe-area-context';
import SearchDisplayScreen from './screens/SearchDisplay';
import LoginScreen from './screens/Login'
import SignupScreen from './screens/Signup'
import SearchFormScreen from './screens/SearchForm'
import StoreDisplayScreen from './screens/StoreDisplay'
import AppointmentsScreen from './screens/Appointments';
import AccountScreen from './screens/Account'
// import { SafeAreaView } from 'react-native-safe-area-context';
// import DropdownAlert from 'react-native-dropdownalert';
// import DropDownHolder from './components/Dropdown'


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

async function getData() {
  try {
    const value = await AsyncStorage.getItem('@user')
    if(value !== null) {
      return value
    }
    else{
      return null
    }
  } catch(e) {
    console.log("error getting user:", e)
    return null
  }
}

async function handleLogout(){
  try {
    await AsyncStorage.removeItem('@user');
    this.setState({
      user: null
    })
  }
  catch(e) {
    console.log(e)
  }
}


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const [user, setUser] = React.useState()

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());
        setUser(await getData())
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    let login;
    let signup;
    let appointments;
    let account;
    if(user){
      appointments = <Drawer.Screen name="Appointments" component={AppointmentsScreen}/>
      account = <Drawer.Screen name="Account" component={AccountScreen}/>
      logout = <Drawer.Screen name="Logout" component={handleLogout}/>
    }
    else{
      login = <Drawer.Screen name="Login" component={LoginScreen} />
      signup = <Drawer.Screen name="Signup" component={SignupScreen} />
    }
    return (
          <NavigationContainer ref={containerRef} initialState={initialNavigationState} backgroundColor={"transparent"}>
            <Drawer.Navigator>
              <Drawer.Screen name="Home" component={HomeStack} />
              {login}
              {signup}
              {appointments}
              {account}
            </Drawer.Navigator>
          </NavigationContainer>
    );
  }
}