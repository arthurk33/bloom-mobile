import MapView from 'react-native-maps';
import * as React from 'react'
import { StyleSheet } from 'react-native'


export default class Map extends React.Component{
  constructor(props) {
    super(props);
    console.log(this.props.center)
  }

 render() {
    return (
      // <Text>hi</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: this.props.center == null ? 37.78825 : parseFloat(this.props.center.lat),
          longitude: this.props.center == null ? -122.4324 : parseFloat(this.props.center.lng),
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0821
        }}
      >
        {this.props.stores == null ? null : this.props.stores.map((store, index) => {
          const coords = {
              latitude: parseFloat(store.lat),
              longitude: parseFloat(store.lng),
          };

          console.log(coords)

          // const metadata = `Status: ${marker.statusValue}`;

          return (
              <MapView.Marker
                  key={index}
                  coordinate={coords}
                  title={store.name}
                  description={store.description}
                  onMarkerPress={() => {
                    this.props.navigation.navigate('StoreDisplay', {
                      store: store
                    })
                  }}
              />
          );
        })}
      </MapView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 750
  },
});