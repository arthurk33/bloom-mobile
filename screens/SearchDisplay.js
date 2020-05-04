import * as React from 'react';
import { Container, Header, Title, Text, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Card, CardItem, Segment } from 'native-base';
import Map from '../components/Map'
import SearchCards from '../components/SearchCards'
import { YellowBox } from 'react-native'
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
  selectComponent = (activePage) => () => this.setState({activePage})

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
      <Container>
        <Header hasSegment>
          <Body>
            <Segment style={{marginLeft: 100}}>
              <Button 
                first 
                active={this.state.activePage === 1}
                onPress={this.selectComponent(1)}>
                  <Text>Cards</Text>
              </Button>
              <Button 
                last 
                active={this.state.activePage === 2}
                onPress={this.selectComponent(2)}>
                  <Text>Map</Text>
              </Button>
            </Segment>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {this._renderComponent()}
       </Content>

        {/* <FlatList
          showsVerticalScrollIndicator='false'
          data={this.props.route.params.stores}
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
                    // source={item.pictures[0]}
                    source={require('../assets/images/salon.jpeg')}
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
      /> */}
    </Container>
    )
  }
}


// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 50,
//     flex: 1,
//     backgroundColor: '#fafafa',
//   },
//   cards: {
//     flex: 1,
//     backgroundColor: '#fafafa',
//     margin: 10,
//     height: 250,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5
//   },
//   card: {
//     backgroundColor: '#fafafa',
//     margin: 10,
//     height: 340,
//     borderColor: "#333",
//     borderWidth: 1,
//     marginBottom: 10,
//     borderRadius: 15,
//     overflow: "hidden"
//   },
//   image: {
//     width: 392,
//     height: 250
//   },
//   cardHeader: {
//     width: '100%',
//     height: 400
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold'
//   },
//   cardText: {
//     fontSize: 15,
//     color: '#444',
//     padding: 1
//   },
//   cardBottom: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 10
//   },
//   cardPhone: {
//     color: 'blue',
//     fontSize: 15,
//     textAlign: 'right'
//   }
// });







// export default function SearchDisplayScreen(props) {
//   console.log("here", props.route.params.stores)
//   const [search, setSearch] = useState('');
//   const [results, setResults] = useState([
//     { title: 'Nails R Us', distance: 0.1, rating: 3.5, numRatings: 5, key: '1' },
//     { title: 'Melody Nails', distance: 0.2, rating: 1.0, numRatings: 10, key: '2' },
//     { title: 'Salons R Us', distance: 1.1, rating: 4.3, numRatings: 15, key: '3' },
//     { title: 'Hye Salon', distance: 2.1, rating: 4.7, numRatings: 20, key: '4' },
//     { title: 'Beauty Store', distance: 2.2, rating: 4.3, numRatings: 25, key: '5' },
//     { title: 'Store Name', distance: 3.1, rating: 4.4, numRatings: 30, key: '6' },
//     { title: 'Shop New Haven', distance: 8.1, rating: 5.0, numRatings: 35, key: '7' },
//     { title: 'SHOP NEW HAVEN', distance: 10.1, rating: 3.8, numRatings: 40, key: '8' },
//     { title: 'The Spot', distance: 20.1, rating: 4.3, numRatings: 45, key: '9' }
//   ])

//   const updateSearch = (search) => {
//     setSearch({ search });
//   };

//   const StarView = ({item}) => {
//     if(item.rating > 4.5) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 4.0) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-half" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 3.5) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 3.0) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-half" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 2.5) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 2.0) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-half" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 1.5) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 1.0) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-half" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else if(item.rating > 0.5) {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//     } else {
//       return <View style={styles.rating}>
//         <Text style={styles.reviewText}>{item.rating} </Text>
//         <MaterialIcons name="star-half" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <MaterialIcons name="star-border" size={20} color="#000" />
//         <Text style={styles.ratingText}>{item.numRatings} Ratings</Text>
//       </View>
//       }
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//               showsVerticalScrollIndicator='false'
//               data={results}
//               keyExtractor={(item) => item.key}
//               renderItem={({ item }) => (
//                 <View style={styles.card}>
//                   <View styles={styles.cardHeader}>
//                     <Image
//                       style={styles.image}
//                       source={require('../assets/images/salon.jpeg')}
//                     />
//                   </View>
//                   <View style={styles.cardBottom}>
//                     <Text style={styles.cardTitle}>{item.title}</Text>
//                     <Text style={styles.cardText}>{item.distance} miles away</Text>
//                     <StarView 
//                       item = {item}
//                     />
//                   </View>
//                 </View>
//               )}
//             />
//       {/* {results.map((result) => {
//         return(
//           <View style={styles.card}>
//           <View styles={styles.cardHeader}>
//             <Image
//               style={styles.image}
//               source={require('../assets/images/salon.jpeg')}
//             />
//           </View>
//           <View style={styles.cardBottom}>
//             <Text style={styles.cardTitle}>{result.title}</Text>
//             <Text style={styles.cardText}>{result.distance} miles away</Text>
//             <StarView 
//               result = {result}
//             />
//           </View>
//         </View>
//         )
//       })

//       } */}
      

//       {/* <ScrollView style={styles.cards} showsVerticalScrollIndicator='false'>
//       {results.map((result) => {
//         return(
//           <View key={result.key} style={styles.card}>
//             <View styles={styles.cardHeader}>
//               <Image
//                 style={{width: 400, height: 250}}
//                 source={require('../assets/images/salon.jpeg')}
//               />
//             </View>
//             <View style={styles.cardBottom}>
//               <Text style={styles.cardText}>{result.title}</Text>
//               <MaterialIcons name="star" size={20} color="#000"/>
//               <MaterialIcons name="star" size={20} color="#000"/>
//               <MaterialIcons name="star" size={20} color="#000"/>
//               <MaterialIcons name="star-half" size={20} color="#000"/>
//               <MaterialIcons name="star-border" size={20} color="#000"/>
//             </View>
//           </View>
//         )
//       })}
//       </ScrollView> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 50,
//     flex: 1,
//     backgroundColor: '#fafafa',
//   },
//   cards: {
//     flex: 1,
//     backgroundColor: '#fafafa',
//     margin: 10,
//     height: 250,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5
//   },
//   card: {
//     backgroundColor: '#fafafa',
//     margin: 10,
//     height: 340,
//     borderColor: "#333",
//     borderWidth: 1,
//     marginBottom: 10,
//     borderRadius: 15,
//     overflow: "hidden"
//   },
//   rating: {
//     flexDirection: 'row'
//   },
//   image: {
//     width: 392,
//     height: 250
//   },
//   cardHeader: {
//     width: '100%',
//     height: 400
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold'
//   },
//   cardText: {
//     fontSize: 15,
//     color: '#444',
//     padding: 1
//   },
//   cardBottom: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 10
//   },
//   searchSection: {
//     maxHeight: 50,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fafafa',
//     borderColor: '#b6b6b6',
//     borderWidth: 1,
//     borderRadius: 5,
//     shadowColor: '#a9a9a9',
//     shadowRadius: 10,
//     shadowOpacity: 0.5,
//     shadowOffset: { width: 0, height: 5 }
//   },
//   searchIcon: {
//     padding: 7,
//     color: '#b6b6b6',
//   },
//   input: {
//     flex: 1,
//     paddingTop: 10,
//     paddingRight: 10,
//     paddingBottom: 10,
//     fontSize: 20,
//     paddingLeft: 0,
//     color: '#424242',
//   }, 
//   ratingText: {
//     paddingTop: 2,
//     marginLeft: 5
//   },
//   reviewText: {
//     paddingTop: 2
//   }
// });
