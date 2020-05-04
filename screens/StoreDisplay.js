import * as React from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';
import categories from '../components/Categories'
import { MaterialIcons } from '@expo/vector-icons';
import { Linking } from 'expo';


export default class StoreDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: null,
      keys: ["Nail Salon",
      "Hair Salon",
      "Barbershops",
      "Facials",
      "Spa & Wellness", 
      "Makeup"],
      actualServices: {
        "Nail Salon": [{name:""}], 
        "Hair Salon": [{name:""}],
        "Barbershops": [{name:""}],
        "Facials": [{name:""}],
        "Spa & Wellness": [{name:""}], 
        "Makeup": [{name:""}]
      }
    };
  }

  componentDidMount(){
    let actualServices = {
      "Nail Salon": [], 
      "Hair Salon": [],
      "Barbershops": [],
      "Facials": [],
      "Spa & Wellness": [], 
      "Makeup": []
    }
    

    for(let i = 0; i < this.props.route.params.store.services.length; i++){
      let service = this.props.route.params.store.services[i]
      let filtered = categories.filter(function(category){ return service.category.includes(category.key) })
      if(filtered.length > 0){
        let test = actualServices[filtered[0].value]
        actualServices[filtered[0].value].push(service)
      }
    }

    Object.keys(actualServices).forEach((key) => (actualServices[key].length == 0) && delete actualServices[key]); 

    console.log(actualServices)
    this.setState({
      actualServices: actualServices,
      keys: Object.keys(actualServices)
    })
  }

  render (){
    return (
      <View style={styles.container}>
        <View style={styles.card} >
          <View styles={styles.cardHeader}>
            <Image
              style={styles.image}
              source={this.props.route.params.store.pictures[0]}
            />
          </View>
          <Content>
            <View style={styles.cardBottom}>
              <Text style={styles.cardTitle}>{this.props.route.params.store.name}</Text>
              <Text style={styles.cardText}>{this.props.route.params.store.description}</Text>
              <Text onPress={()=>{Linking.openURL('tel:' + this.props.route.params.store.phone);}} style={styles.cardPhone}>
                <MaterialIcons name="phone" /> : 
                {this.props.route.params.store.phone}
              </Text>
            </View>

            <Text style={styles.cardTitle}>Services</Text>

            <FlatList
                showsVerticalScrollIndicator='false'
                data={this.state.keys}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View>
                    <ListItem>
                      <Text>Category: {item}</Text>
                    </ListItem>
                    <FlatList
                        showsVerticalScrollIndicator='false'
                        data={this.state.actualServices[item]}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ListItem itemDivider id={"servce-" + item.id}>
                              <Text>Service: {item.name}{"\n\n"}{item.description}{"\n\n"}{"$" + item.cost}{"\n\n"}{item.duration + " minutes"}</Text>
                            </ListItem>
                        )}
                    />

                  </View>
                )}
            />

            {/* <List 
                dataArray={this.state.keys}
                renderRow={(dictKey, index) =>
                <ListItem key={"category" + index}>
                  <Text>{this.state.actualServices[dictKey].name}</Text>
                </ListItem>
            }/> */}
          </Content>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fafafa',
  },
  card: {
    backgroundColor: '#fafafa',
    margin: 10,
    height: '100%',
    marginBottom: 10,
    borderRadius: 15,
    overflow: "hidden"
  },
  image: {
    width: 392,
    height: 250
  },
  cardHeader: {
    width: '100%',
    height: 250
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center'
  },
  cardText: {
    fontSize: 20,
    color: '#444',
    padding: 1,
    marginBottom: 100
  },
  cardBottom: {
    flex: 1,
    padding: 10
  },
  cardPhone: {
    color: 'blue',
    fontSize: 15,
    textAlign: 'right'
  }
});
