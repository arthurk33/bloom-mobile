import React, { Component} from 'react'
import { StyleSheet } from 'react-native'
import SearchForm from './SearchForm';
import { YellowBox } from 'react-native'
import { Container, Header, Title, Content, Right, Body, Card, Left } from 'native-base';

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      user: null,
    };
  }

 render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left/>
          <Body>
            <Title>Bloom</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Card style={{marginTop: 200, marginLeft: 20, marginRight: 20, borderRadius: "10px"}}>
            <SearchForm navigation={this.props.navigation}/>
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
});

export default HomeScreen;