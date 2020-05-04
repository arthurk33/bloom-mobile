import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  // Text,
  View,
  AsyncStorage
} from 'react-native'
import { YellowBox } from 'react-native'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Card, CardItem } from 'native-base';




YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

export default class AppointmentsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      appointments: null
    };
  }

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

  async getAppointments(user_id){
    await fetch('http://192.168.1.24:8081/users/' + user_id + "/appointments", {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'  // not going to work until we eject?..
    })
    .then(function(response){
      if(response.status!==200){
        // throw an error alert
        console.log(JSON.stringify(response))
      }
      else{
        return response.json();
      }
    })
    .then(data => {
      if(data){
        console.log("Appointments:", data)
        this.setState({
          appointments: data
        })
      }
    });
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
   let userSession, appointments = null
   
   if(this.state.user == null){
     userSession =  <Button transparent onPress={() => this.props.navigation.navigate('Login')}>
                  <Text>Login</Text>
                </Button>

   }
   else{
    userSession =  <Button transparent onPress={() => this.handleLogout()}>
                  <Text>Logout</Text>
                </Button>
    
    // appointments = 
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
              <Text>
                Appointments go here
              </Text>
            </CardItem>
          </Card>
        </Content>

        {footer}
      </Container>
    )
  }
}