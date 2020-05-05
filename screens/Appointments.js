import React, { Component } from 'react'
import { YellowBox, StyleSheet } from 'react-native'
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

 render() {
    return (
      <Container style={styles.container}>
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
          <Card style={{marginTop: 40, paddingTop: 20, paddingBottom: 20, marginLeft: 20, marginRight: 20, borderRadius: "10px"}}>
            <CardItem header>
              <Text>Your Appointments:</Text>
            </CardItem>
            <CardItem>
              <Text>
                You have no appointments!
              </Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0CBCF',
    height: '100%',
  },
})
