import * as React from 'react'
import {TouchableOpacity, View, Image, Text, StyleSheet, FlatList} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

export default class SearchCards extends React.Component{
  constructor(props) {
    super(props);
  }

 render() {
    return (
      <FlatList
          showsVerticalScrollIndicator='false'
          data={this.props.stores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // <Card title='Customized Card 1' expanded={false}>
            //     <Text>Hello, this is first line.</Text>
            //     <Text>Hello, this is second line.</Text>
            //     <Text>Hello, this is third line.</Text>
            // </Card>
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('StoreDisplay', {
                  store: item
                })
              }}>
              <View style={styles.card} >
                <View styles={styles.cardHeader}>
                  <Image
                    style={styles.image}
                    source={item.pictures[0]}
                  />
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text onPress={()=>{Linking.openURL('tel:' + item.phone);}} style={styles.cardPhone}>
                    <MaterialIcons name="phone" /> : 
                    {item.phone}
                  </Text>
                  <Text style={styles.cardText}>{item.distance.toFixed(2)} miles away</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fafafa',
  },
  cards: {
    flex: 1,
    backgroundColor: '#fafafa',
    margin: 10,
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  card: {
    backgroundColor: '#fafafa',
    margin: 10,
    height: 340,
    borderColor: "#333",
    borderWidth: 1,
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
    height: 400
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  cardText: {
    fontSize: 15,
    color: '#444',
    padding: 1
  },
  cardBottom: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  cardPhone: {
    color: 'blue',
    fontSize: 15,
    textAlign: 'right'
  }
});