import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  // Text,
  View,
  AsyncStorage
} from 'react-native'
// import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { YellowBox } from 'react-native'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Card, CardItem } from 'native-base';




YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

export default class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
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
      console.log("logout!")
      this.setState({
        user: null
      })
    }
    catch(e) {
      console.log(e)
    }
  }

 render() {
   let userSession, info = null
   if(this.state.user == null){
     userSession =  <Button transparent onPress={() => this.props.navigation.navigate('Login')}>
                  <Text>Login</Text>
                </Button>

   }
   else{
    userSession =  <Button transparent onPress={() => this.handleLogout()}>
                  <Text>Logout</Text>
                </Button>
    info = <View>
      <CardItem>
              <Text>
                {this.state.user.first_name} {this.state.user.last_name}
              </Text>
            </CardItem>

            <CardItem>
              <Text>
                {this.state.user.email}
              </Text>
            </CardItem>

            <CardItem>
              <Text>
                {this.state.user.phone} {this.state.user.phone}
              </Text>
            </CardItem>
    </View>
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
            {info}
          </Card>
        </Content>
      </Container>
    )
  }
}