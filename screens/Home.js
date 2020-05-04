import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  // Text,
  View,
  AsyncStorage
} from 'react-native'
// import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import FlashMessage from "react-native-flash-message";
import SearchForm from './SearchForm';
import { YellowBox } from 'react-native'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Card, CardItem } from 'native-base';




YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

// import * as WebBrowser from 'expo-web-browser';
// import { MonoText } from '../components/StyledText';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      user: null
    };
  }

  // onPress = () => {
  //   this.setState({
  //     count: this.state.count + 1
  //   })
  // }

  async componentDidUpdate(prevProps){
    if(prevProps != this.props){
      let user = JSON.parse(await this.getData(user))
      this.setState({
        user: user
      })
    }
  }

  async componentDidMount(){
    let user = JSON.parse(await this.getData(user))
    this.setState({
      user: user
    })
  }

  getData = async () => {
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

  async handleLogout(){
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

 render() {
   let userSession = null
   if(this.state.user == null){
     userSession =  <Button transparent onPress={() => this.props.navigation.navigate('Login')}>
                  <Text>Login</Text>
                </Button>

   }
   else{
    userSession =  <Button transparent onPress={() => this.handleLogout()}>
                  <Text>Logout</Text>
                </Button>
   }
    return (
      <Container>
        <Header>
          <Left>
            {userSession}
          </Left>
          <Body>
            <Title>Bloom</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Card>
            <CardItem>
              <SearchForm navigation={this.props.navigation}/>
            </CardItem>
            <Button transparent onPress={() => this.props.navigation.navigate('Appointments')}>
              <Text>Appointments</Text>
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate('Account')}>
              <Text>Account</Text>
            </Button>
          </Card>
        </Content>
      </Container>

      // <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      //   <View>
      //     {userSession}
      //   </View>
        
      // </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    width: 75
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 35,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

export default HomeScreen;






// import * as React from 'react';
// import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import * as WebBrowser from 'expo-web-browser';

// import { MonoText } from '../components/StyledText';

// export default function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//         <View style={styles.welcomeContainer}>
//           <Image
//             source={
//               __DEV__
//                 ? require('../assets/images/robot-dev.png')
//                 : require('../assets/images/robot-prod.png')
//             }
//             style={styles.welcomeImage}
//           />
//         </View>

//         <View style={styles.getStartedContainer}>
//           <DevelopmentModeNotice />

//           <Text style={styles.getStartedText}>Open up the code for this screen:</Text>

//           <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
//             <MonoText>screens/HomeScreen.js</MonoText>
//           </View>

//           <Text style={styles.getStartedText}>
//             Change any of the text, save the file, and your app will automatically reload.
//           </Text>
//         </View>

//         <View style={styles.helpContainer}>
//           <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
//             <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <View style={styles.tabBarInfoContainer}>
//         <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

//         <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
//           <MonoText style={styles.codeHighlightText}>navigation/BottomTabNavigator.js</MonoText>
//         </View>
//       </View>
//     </View>
//   );
// }

// HomeScreen.navigationOptions = {
//   header: null,
// };

// function DevelopmentModeNotice() {
//   if (__DEV__) {
//     const learnMoreButton = (
//       <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
//         Learn more
//       </Text>
//     );

//     return (
//       <Text style={styles.developmentModeText}>
//         Development mode is enabled: your app will be slower but you can use useful development
//         tools. {learnMoreButton}
//       </Text>
//     );
//   } else {
//     return (
//       <Text style={styles.developmentModeText}>
//         You are not in development mode: your app will run at full speed.
//       </Text>
//     );
//   }
// }

// function handleLearnMorePress() {
//   WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
// }

// function handleHelpPress() {
//   WebBrowser.openBrowserAsync(
//     'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
//   );
// }
