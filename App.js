import 'react-native-gesture-handler';
import * as React from 'react';
// import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { SplashScreen } from 'expo';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

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


const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());
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
    return (
          <NavigationContainer ref={containerRef} initialState={initialNavigationState} backgroundColor={"transparent"}>
            {/* <DropdownAlert ref={(ref) => DropDownHolder.setDropDown(ref)}/> */}
            <Stack.Navigator 
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
              <Stack.Screen name="root" component={HomeScreen} />
              <Stack.Screen name="SearchForm" component={SearchFormScreen} />
              <Stack.Screen name="SearchDisplay" component={SearchDisplayScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="StoreDisplay" component={StoreDisplayScreen}/>
              <Stack.Screen name="Appointments" component={AppointmentsScreen}/>
              <Stack.Screen name="Account" component={AccountScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
    );
  }
}