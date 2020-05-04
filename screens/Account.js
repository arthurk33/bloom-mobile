import React, { Component } from 'react'
import {
  View,
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

 render() {
   let info = null
   if(this.state.user){
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
            <Button transparent onPress={() => this.props.navigation.goBack()}t>
              <Icon name='arrow-back' />
            </Button>
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