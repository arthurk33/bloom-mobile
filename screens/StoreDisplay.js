import * as React from 'react';
import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default class StoreDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: null
    };
  }

  componentDidMount(){
  }

  render (){
    return (
      <View style={styles.container}>
        <View style={styles.card} >
          <View styles={styles.cardHeader}>
            <Image
              style={styles.image}
              source={require('../assets/images/salon.jpeg')}
            />
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.cardTitle}>{this.props.route.params.store.name}</Text>
            <Text style={styles.cardText}>{this.props.route.params.store.description}</Text>
          </View>
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
    fontSize: 15,
    color: '#444',
    padding: 1
  },
  cardBottom: {
    flex: 1,
    padding: 10
  }
});
