import * as React from 'react';
import { Container, Header, Title, Text, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Card, CardItem, Segment } from 'native-base';
import Map from '../components/Map'
import SearchCards from '../components/SearchCards'
import { YellowBox, StyleSheet, View, Switch } from 'react-native'
YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

export default class SearchDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
    
    this.showStore = this.showStore.bind(this)
  }

  // CITATION: https://stackoverflow.com/questions/52392725/changing-segment-content-onpress
  selectComponent = (activePage) => () => this.setState({activePage: activePage, switchValue: !this.state.switchValue})

  _renderComponent = () => {
    if(this.state.activePage === 2){
      return <Map stores={this.props.route.params.stores} navigation={this.props.navigation} center={this.props.route.params.center}/>
    }
    else {
      return <SearchCards stores={this.props.route.params.stores} navigation={this.props.navigation}/>
    }
  }

  showStore(store){
    console.log(store)
  }

  render (){
    return (
      <Container style = {styles.container}>
        <Header hasSegment>
          <Body>
            <View style = {styles.switch}>
              <Switch
              onValueChange = {this.state.switchValue ? this.selectComponent(1) : this.selectComponent(2)}
              value = {this.state.switchValue}
              trackColor={{ false: "#767577", true: "#8794ab" }}
              />
           </View>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {this._renderComponent()}
       </Content>
    </Container>
    )
  }
}


const styles = StyleSheet.create({
  switch: {
    alignSelf: 'center',
    marginLeft: 100
 },
 container: {
  flex: 1,
  backgroundColor: '#C0CBCF',
  height: '100%',
 }
});