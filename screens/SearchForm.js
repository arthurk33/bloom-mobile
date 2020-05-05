// CITATION: https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Alert, Picker } from 'react-native'
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
          }

          this.props.navigation.navigate('SearchDisplay', {
            stores: data.stores,
            center: data.center
          })
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
          <GooglePlacesAutocomplete
            name="address"
            placeholder='Search'
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
                margin: 15
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

          <View style={{ flex: 1 }}>
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

          <View style={{ flex: 1 }}>
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
            <FormButton
              buttonType='outline'
              onPress={this.handleSubmit}
              title='Search'
              buttonColor='#039BE5'
            />
          </View>
        </Fragment>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    margin: 25
  }
})










// // CITATION: https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
// import React, { Fragment } from 'react'
// import * as Yup from 'yup'
// // import ErrorMessage from '../components/ErrorMessage'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import { View, Text, Button } from 'native-base';
// import GenerateForm from 'react-native-form-builder';
// import { AppRegistry } from 'react-native';

// const validationSchema = Yup.object().shape({
//   email: Yup.string()
//     .label('Email')
//     .email('Enter a valid email')
//     .required('Please enter a registered email'),
//   password: Yup.string()
//     .label('Password')
//     .required()
//     .min(6, 'Password must be at least 6 characters '),
// })

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

// const styles = {
//   wrapper: {
//     flex: 1,
//     marginTop: 150,
//   },
//   submitButton: {
//     paddingHorizontal: 10,
//     paddingTop: 20,
//   },
// };
// // These Fields will create a login form with three fields
// const fields = [
//   {
//     type: 'picker',
//     name: 'distance',
//     required: true,
//     icon: 'car',
//     label: 'Distance (miles)',
//     options: ['1', '5', '10', '25']
//   },
//   {
//     type: 'select',
//     multiple: true,
//     name: 'category',
//     icon: 'chair',
//     required: true,
//     label: 'Category',
//     options: ['Nails', 'Hair', 'Makeup', 'Eyelashes', 'Eyelash Extensions', 'Hair Extensions', 'Eyebrows', 'Facials', 'Skin', 'Waxing', 'Mens']
//   }
// ];

// export default class SearchForm extends React.Component {
//   search() {
//     const formValues = this.formGenerator.getValues();
//     console.log('FORM VALUES', formValues);
//   }

//   // handleSubmit = (values, actions) => {
//   //   if (values.email.length > 0 && values.password.length > 0) {
//   //     console.log(values)
//   //     fetch('http://192.168.1.24:8081/login' , {
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       method: "POST",
//   //       body: JSON.stringify({
//   //         "email": values.email,
//   //         "password": values.password
//   //       })
//   //     })
//   //     .then(function(response){
//   //       if(response.status!==200){
//   //         console.log(JSON.stringify(response))
//   //         alert("Invalid email/password!");
//   //       }
//   //       else{
//   //         return response.json()
//   //       }
//   //     })
//   //     .then(data => {
//   //       if(data){
//   //         console.log(data)
//   //         this.props.navigation.navigate('root')
//   //       }
//   //     })
//   //     .finally(() => {
//   //       actions.setSubmitting(false);
//   //     })
//   //   }
//   // }


//   render() {
//     return (
//       <View style={styles.wrapper}>
//         <View>
//           <GooglePlacesAutocomplete
//             placeholder='Search'
//             minLength={2} // minimum length of text to search
//             autoFocus={false}
//             // returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
//             // listViewDisplayed='auto'    // true/false/undefined
//             // fetchDetails={true}
//             // renderDescription={row => row.description} // custom description render
//             onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
//               console.log(data.description);
//               // this.handlePlaceSelect(data)
//               props.setFieldValue("address", data.description)
//             }}
            
//             getDefaultValue={() => ''}
            
//             query={{
//               // available options: https://developers.google.com/places/web-service/autocomplete
//               key: 'AIzaSyBcz_rgnnIcA7JzPU25Ap_CFYhAGeXhCWU',
//               language: 'en', // language of the results
//             }}
            
//             styles={{
//               textInputContainer: {
//                 margin: 15
//               },
//               iconStyle: {
//                 marginRight: 10
//               }
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

//           <GenerateForm
//             ref={(c) => {
//               this.formGenerator = c;
//             }}
//             fields={fields}
//           />
//         </View>
//         <View style={styles.submitButton}>
//           <Button block onPress={() => this.login()}>
//             <Text>Login</Text>
//           </Button>
//         </View>
//       </View>
//     )
//   }
// }

// AppRegistry.registerComponent('FormGenerator', () => FormGenerator);