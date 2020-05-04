import React, { Component } from 'react'
import {
  View,
} from 'react-native'
// import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { YellowBox } from 'react-native'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class AccountScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidUpdate(prevProps, prevState){
    if (prevProps.user !== this.props.user) {
      this.setState({
        update: true
      })
    }
   }

 render() {
   let info = null
   if(this.props.user){
    info = <View>
      <CardItem>
              <Text>
                Name: {this.props.user.first_name} {this.props.user.last_name}
              </Text>
            </CardItem>

            <CardItem>
              <Text>
                Email: {this.props.user.email}
              </Text>
            </CardItem>

            <CardItem>
              <Text>
                Phone: {this.props.user.phone}
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

const mapStateToProps = (state) => {
  return {
      user: state.userReducer.user
  }
}

export default connect(mapStateToProps)(AccountScreen);