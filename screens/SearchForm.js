// CITATION: https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Alert, Picker, TouchableHighlight, Text } from 'react-native'
// import { Button } from 'react-native-elements'
// import { Formik } from 'formik'
// import * as Yup from 'yup'
// import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
// import ErrorMessage from '../components/ErrorMessage'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MultiSelect from 'react-native-multiple-select';
import categories from '../components/Categories'
// import Config from 'react-native-config'


// const validationSchema = Yup.object().shape({
//   address: Yup.string()
//     .label('Address')
//     .required('Please enter an address'),
// })

// CITATION: https://stackoverflow.com/questions/37230555/get-with-query-string-with-fetch-in-react-native
function queryString(query) {
  // get array of key value pairs ([[k1, v1], [k2, v2]])
  const qs = Object.entries(query)
    // filter pairs with undefined value
    .filter(pair => pair[1] !== undefined)
    // encode keys and values, remove the value if it is null, but leave the key
    .map(pair => pair.filter(i => i !== null).map(encodeURIComponent).join('='))
    .join('&');

  return qs && '?' + qs;
}

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // address: null,
      address: '10304, Marcus Avenue, Tujunga, Los Angeles, Los Angeles County, California, United States, 91042, 2010',
      selectedItems: [],
      selectedItemDistance: []
    };

    this.optionsDistance = [
      { id: "1", name: '1 mile' },
      { id: "5", name: '5 miles' },
      { id: "10", name: '10 miles' },
      { id: "25", name: '25 miles' },
      { id: "50", name: '50 miles' }
    ];

    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
    this.onSelectedItemsChangeDistance = this.onSelectedItemsChangeDistance.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
  }
 
  onSelectedItemsChange = selectedItemsPassed => {
    this.setState({
      selectedItems: selectedItemsPassed
    })
  };

  onSelectedItemsChangeDistance = selectedItemPassed => {
    this.setState({
      selectedItemDistance: selectedItemPassed
    })
  };

  async getPictures(prefixPassed) {
    const response = await fetch('http://192.168.1.24:8081/getImages', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        // credentials: 'include',
        body: JSON.stringify({prefix: prefixPassed})
      })
      .then(function(response){
        if(response.status!==200){
          // throw an error alert
          console.log("ERROR!", response)
        }
        else{
          return response.json();
        }
      })
      .then(data => {
        if(data){
          return data
        }
      });    

    return response
  }

  async getServices(store_id){
    let response = await fetch('http://192.168.1.24:8081/stores/' + store_id + "/services/", {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      // credentials: 'include'
    })
    .then(function(response){
      if(response.status!==200){
        // throw an error alert
        console.log("ERROR!")
      }
      else{
        return response.json();
      }
    })
    .then(data => {
      if(data){
        return data
      }
    });

    return response
  }
  
  

  handleSubmit() {
    if (this.state.address && this.state.address.length > 0 && this.state.selectedItemDistance.length > 0) {
      let modifyState = function(state) {
        return {
          address: state.address,
          distance: parseInt(state.selectedItemDistance[0]),
          nails: state.selectedItems.includes("Nails"),
          hair: state.selectedItems.includes("Hair"),
          makeup: state.selectedItems.includes("Makeup"),
          facials: state.selectedItems.includes("Facials"),
          barber: state.selectedItems.includes("Barber"),
          spa: state.selectedItems.includes("Spa"),
        }
      }

      let modifiedState = modifyState(this.state)
      let query = queryString(modifiedState)
      let getPictures = this.getPictures
      let getServices = this.getServices
      
      fetch('http://192.168.1.24:8081/stores' + query, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "GET"
      })
      .then(function(response){
        if(response.status!==200){
          alert("Invalid search!");
        }
        else{
          return response.json()
        }
      })
      .then(async data => {
        if(data){
          if(data.stores.length > 0){
            for(let i = 0; i < data.stores.length; i++){
              let pictures = await getPictures('stores/' + data.stores[i].id + '/images/')
              let services = await getServices(data.stores[i].id)

              data.stores[i].pictures = pictures
              data.stores[i].services = services
            }

            this.props.navigation.navigate('SearchDisplay', {
              stores: data.stores,
              center: data.center
            })
          }
          else{
            alert("No search results!");
          }
        }
      })
    }
  }

  handlePlaceSelect(data) {
    this.setState({
      address: data.description
    })
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Fragment>
          <Text style={styles.title}>
            Search Now
          </Text>
          <GooglePlacesAutocomplete
            name="address"
            placeholder="Try 'New Haven, CT'"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            // returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            // listViewDisplayed='auto'    // true/false/undefined
            // fetchDetails={true}
            // renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              if(data.description){
                this.setState({
                  address: data.description
                })
              }
              else if(data.vicinity){
                this.setState({
                  address: data.vicinity
                })
              }
              else{
                console.log(data)
              }
            }}
            
            getDefaultValue={() => ''}
            
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: '',
              language: 'en', // language of the results
            }}
            
            styles={{
              textInputContainer: {
                margin: 10
              },
              iconStyle: {
                marginRight: 10
              }
            }}
            
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              types: 'food'
            }}

            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

            // debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
            // renderRightButton={() => <Text>Custom text after the input</Text>}
          />

          <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
            <MultiSelect
              single={true}
              hideTags
              items={this.optionsDistance}
              uniqueKey="id"
              // ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={this.onSelectedItemsChangeDistance}
              selectedItems={this.state.selectedItemDistance}
              selectText="Select Distance"
              searchInputPlaceholderText="Within..."
              onChangeInput={ (text)=> console.log(text)}
              // altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{ color: '#CCC' }}
              submitButtonColor="#CCC"
              submitButtonText="Done"
            />
          </View>

          <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
            <MultiSelect
              hideTags
              items={categories}
              uniqueKey="key"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={this.state.selectedItems}
              selectText="Select Category"
              searchInputPlaceholderText="Search Categories..."
              onChangeInput={ (text)=> console.log(text)}
              // altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="value"
              searchInputStyle={{ color: '#CCC' }}
              submitButtonColor="#CCC"
              submitButtonText="Done"
            />
            <View>
              {this.multiSelect && this.multiSelect.getSelectedItemsExt(this.state.selectedItems)}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableHighlight
              onPress={this.handleSubmit}
              // title='Search'
            >
              <Text style={styles.button}>Search</Text>
            </TouchableHighlight>
          </View>
        </Fragment>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center'
  },
  buttonContainer: {
    margin: 25,
    backgroundColor: '#354A74',
    width: '30%',
    alignSelf: 'center',
    height: 40,
    fontSize: 10,
    borderRadius: 10
  },
  button: {
    fontSize:15,
    color: 'white',
    alignSelf: 'center',
    paddingTop: 10,
  }
})


// // CITATION: https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
// import React, { Fragment } from 'react'
// import { StyleSheet, SafeAreaView, View, Alert, Picker, TouchableHighlight, Text } from 'react-native'
// // import { Button } from 'react-native-elements'
// // import { Formik } from 'formik'
// // import * as Yup from 'yup'
// // import FormInput from '../components/FormInput'
// import FormButton from '../components/FormButton'
// // import ErrorMessage from '../components/ErrorMessage'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import MultiSelect from 'react-native-multiple-select';
// import categories from '../components/Categories'
// // import Config from 'react-native-config'


// // const validationSchema = Yup.object().shape({
// //   address: Yup.string()
// //     .label('Address')
// //     .required('Please enter an address'),
// // })

// // CITATION: https://stackoverflow.com/questions/37230555/get-with-query-string-with-fetch-in-react-native
// function queryString(query) {
//   // get array of key value pairs ([[k1, v1], [k2, v2]])
//   const qs = Object.entries(query)
//     // filter pairs with undefined value
//     .filter(pair => pair[1] !== undefined)
//     // encode keys and values, remove the value if it is null, but leave the key
//     .map(pair => pair.filter(i => i !== null).map(encodeURIComponent).join('='))
//     .join('&');

//   return qs && '?' + qs;
// }

// export default class SearchForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // address: null,
//       address: '10304, Marcus Avenue, Tujunga, Los Angeles, Los Angeles County, California, United States, 91042, 2010',
//       selectedItems: [],
//       selectedItemDistance: []
//     };

//     this.optionsDistance = [
//       { id: "1", name: '1 mile' },
//       { id: "5", name: '5 miles' },
//       { id: "10", name: '10 miles' },
//       { id: "25", name: '25 miles' },
//       { id: "50", name: '50 miles' }
//     ];

//     this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
//     this.onSelectedItemsChangeDistance = this.onSelectedItemsChangeDistance.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
//   }

//   onSelectedItemsChange = selectedItemsPassed => {
//     this.setState({
//       selectedItems: selectedItemsPassed
//     })
//   };

//   onSelectedItemsChangeDistance = selectedItemPassed => {
//     this.setState({
//       selectedItemDistance: selectedItemPassed
//     })
//   };

//   async getPictures(prefixPassed) {
//     const response = await fetch('http://192.168.1.24:8081/getImages', {
//         method: "POST",
//         headers: {
//             'Content-type': 'application/json'
//         },
//         // credentials: 'include',
//         body: JSON.stringify({prefix: prefixPassed})
//       })
//       .then(function(response){
//         if(response.status!==200){
//           // throw an error alert
//           console.log("ERROR!", response)
//         }
//         else{
//           return response.json();
//         }
//       })
//       .then(data => {
//         if(data){
//           return data
//         }
//       });

//     return response
//   }

//   async getServices(store_id){
//     let response = await fetch('http://192.168.1.24:8081/stores/' + store_id + "/services/", {
//       method: "GET",
//       headers: {
//           'Content-type': 'application/json'
//       },
//       // credentials: 'include'
//     })
//     .then(function(response){
//       if(response.status!==200){
//         // throw an error alert
//         console.log("ERROR!")
//       }
//       else{
//         return response.json();
//       }
//     })
//     .then(data => {
//       if(data){
//         return data
//       }
//     });

//     return response
//   }



//   handleSubmit() {
//     if (this.state.address && this.state.address.length > 0 && this.state.selectedItemDistance.length > 0) {
//       let modifyState = function(state) {
//         return {
//           address: state.address,
//           distance: parseInt(state.selectedItemDistance[0]),
//           nails: state.selectedItems.includes("Nails"),
//           hair: state.selectedItems.includes("Hair"),
//           makeup: state.selectedItems.includes("Makeup"),
//           facials: state.selectedItems.includes("Facials"),
//           barber: state.selectedItems.includes("Barber"),
//           spa: state.selectedItems.includes("Spa"),
//         }
//       }

//       let modifiedState = modifyState(this.state)
//       let query = queryString(modifiedState)
//       let getPictures = this.getPictures
//       let getServices = this.getServices

//       fetch('http://192.168.1.24:8081/stores' + query, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         method: "GET"
//       })
//       .then(function(response){
//         if(response.status!==200){
//           alert("Invalid search!");
//         }
//         else{
//           return response.json()
//         }
//       })
//       .then(async data => {
//         if(data){
//           if(data.stores.length > 0){
//             for(let i = 0; i < data.stores.length; i++){
//               let pictures = await getPictures('stores/' + data.stores[i].id + '/images/')
//               let services = await getServices(data.stores[i].id)

//               data.stores[i].pictures = pictures
//               data.stores[i].services = services
//             }
//           }

//           this.props.navigation.navigate('SearchDisplay', {
//             stores: data.stores,
//             center: data.center
//           })
//         }
//       })
//     }
//   }

//   handlePlaceSelect(data) {
//     this.setState({
//       address: data.description
//     })
//   }


//   render() {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Fragment>
//           <GooglePlacesAutocomplete
//             name="address"
//             placeholder='Search'
//             minLength={2} // minimum length of text to search
//             autoFocus={false}
//             // returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
//             // listViewDisplayed='auto'    // true/false/undefined
//             // fetchDetails={true}
//             // renderDescription={row => row.description} // custom description render
//             onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
//               if(data.description){
//                 this.setState({
//                   address: data.description
//                 })
//               }
//               else if(data.vicinity){
//                 this.setState({
//                   address: data.vicinity
//                 })
//               }
//               else{
//                 console.log(data)
//               }
//             }}

//             getDefaultValue={() => ''}

//             query={{
//               // available options: https://developers.google.com/places/web-service/autocomplete
//               key: '',
//               language: 'en', // language of the results
//             }}

//             styles={{
//               textInputContainer: {

//               width: '70%',
//               margin: '5%',
//               alignSelf: 'center',
//               backgroundColor: 'rgba(255,255,255,1)',
//               // borderTopWidth: 1,
//               // borderBottomWidth:1,
//               // borderLeftWidth: 1,
//               // borderRightWidth: 1,
//               height: '50%'

//               },
//               textInput: {
//                 // marginLeft: 10,
//                 marginRight: 0,
//                 height: 25,
//                 color: '#5d5d5d',
//                 fontSize: 16,

//               },
//               predefinedPlacesDescription: {
//                 color: '#1faadb'
//               },
//             }}

//             currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
//             currentLocationLabel="Current location"
//             nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
//             GoogleReverseGeocodingQuery={{
//               // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
//             }}
//             GooglePlacesSearchQuery={{
//               // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
//               rankby: 'distance',
//               types: 'food'
//             }}

//             filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

//             // debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
//             // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
//             // renderRightButton={() => <Text>Custom text after the input</Text>}
//           />

//           <View style={{flexDirection: 'row', display: 'flex'}}>
//           <View style={{ flex: 1, alignItems: 'center'}}>
//             <MultiSelect
//               single={true}
//               hideTags
//               items={this.optionsDistance}
//               uniqueKey="id"
//               // ref={(component) => { this.multiSelect = component }}
//               onSelectedItemsChange={this.onSelectedItemsChangeDistance}
//               selectedItems={this.state.selectedItemDistance}
//               selectText="Distance"
//               searchInputPlaceholderText="Within..."
//               onChangeInput={ (text)=> console.log(text)}
//               // altFontFamily="ProximaNova-Light"
//               tagRemoveIconColor="#CCC"
//               tagBorderColor="#CCC"
//               tagTextColor="#CCC"
//               selectedItemTextColor="#CCC"
//               selectedItemIconColor="#CCC"
//               itemTextColor="#000"
//               displayKey="name"
//               searchInputStyle={{ color: '#CCC' }}
//               submitButtonColor="#CCC"
//               submitButtonText="Done"
//               iconSearch={(null, null, false)}
//               // styleDropdownMenu={{borderTopRightRadius: 20}}
//               styleDropdownMenuSubsection={{borderRadius: 15, padding: 10, height: 40}}
//               styleMainWrapper={{width: '80%',marginLeft: '15%'}}
//               styleTextDropdown={{paddingLeft: 15}}
//               // styleSelectorContainer={{borderTopRightRadius: 20}}
//             />
//           </View>

//           <View style={{ flex: 1, alignItems: 'center'}}>
//             <MultiSelect
//               hideTags
//               items={categories}
//               uniqueKey="key"
//               ref={(component) => { this.multiSelect = component }}
//               onSelectedItemsChange={this.onSelectedItemsChange}
//               selectedItems={this.state.selectedItems}
//               selectText="Category"
//               searchInputPlaceholderText="Search Categories..."
//               onChangeInput={ (text)=> console.log(text)}
//               // altFontFamily="ProximaNova-Light"
//               tagRemoveIconColor="#CCC"
//               tagBorderColor="#CCC"
//               tagTextColor="#CCC"
//               selectedItemTextColor="#CCC"
//               selectedItemIconColor="#CCC"
//               itemTextColor="#000"
//               displayKey="value"
//               searchInputStyle={{ color: '#CCC', borderTopRightRadius: 20}}
//               submitButtonColor="#CCC"
//               submitButtonText="Done"
//               styleDropdownMenuSubsection={{borderRadius: 15, padding: 10, height: 40}}
//               styleMainWrapper={{width: '80%', marginRight: '15%'}}
//               styleTextDropdown={{paddingLeft: 15}}

//             />
//             </View>
//             <View>
//               {this.multiSelect && this.multiSelect.getSelectedItemsExt(this.state.selectedItems)}
//             </View>
//           </View>

//           <View style={styles.buttonContainer}>
//             <TouchableHighlight

//               onPress={this.handleSubmit}
//               // title='Search'

//             ><Text style={styles.button}>Search</Text></TouchableHighlight>
//           </View>
//         </Fragment>
//       </SafeAreaView>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#C0CBCF'
//   },
//   buttonContainer: {
//     margin: 25,
//     backgroundColor: '#354A74',
//     width: '30%',
//     alignSelf: 'center',
//     height: '15%',
//     fontSize: 10,
//     borderRadius: 10
//   },
//   button: {
//     fontSize:15,
//     color: 'white',
//     alignSelf: 'center',
//     padding:5
//   }

// })