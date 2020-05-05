import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, TouchableOpacity, TouchableHighlight, Text} from 'react-native'
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must be at least 6 characters '),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must matched Password')
    .required('Confirm Password is required')
})

export default class Signup extends React.Component {
  goToLogin = () => this.props.navigation.navigate('Login')

  handleSubmit = values => {
    if (values.email.length > 0 && values.password.length > 0) {
      setTimeout(() => {
        this.props.navigation.navigate('App')
      }, 3000)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            if (values.email.length > 0 && values.password.length > 0) {
              fetch('http://192.168.1.24:8081/signUp' , {
                headers: {
                  'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify(values)
              })
              .then(function(response){
                if(response.status!==200){
                  alert("Unable to signup!");
                }
                else{
                  return response.json()
                }
              })
              .then(data => {
                if(data){
                  this.props.navigation.navigate('Home')
                }
                else{
                  actions.setSubmitting(false);
                }
              })
            }
          }}
          >
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting
          }) => (
            <Fragment>
              <FormInput
                containerStyle={styles.input}
                name='name'
                value={values.name}
                onChangeText={handleChange('name')}
                placeholder='Enter your full name'
                iconName='user'
                iconColor='#2C384A'
                onBlur={handleBlur('name')}
                autoFocus
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
              <FormInput
                containerStyle={styles.input}
                name='email'
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder='Enter email'
                autoCapitalize='none'
                iconName='mail-forward'
                iconColor='#2C384A'
                onBlur={handleBlur('email')}
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <FormInput
                containerStyle={styles.input}
                name='password'
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder='Enter password'
                secureTextEntry
                iconName='unlock'
                iconColor='#2C384A'
                onBlur={handleBlur('password')}
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <FormInput
                containerStyle={styles.input}
                name='password'
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                placeholder='Confirm password'
                secureTextEntry
                iconName='lock'
                iconColor='#2C384A'
                onBlur={handleBlur('confirmPassword')}
              />
              <ErrorMessage
                errorValue={touched.confirmPassword && errors.confirmPassword}
              />
              <View style={styles.buttonContainer}>
                <TouchableHighlight
                   onPress={handleSubmit}
                   disabled={!isValid || isSubmitting}
                   loading={isSubmitting}
                ><Text style={styles.button}>Sign Up</Text></TouchableHighlight>
              </View>
            </Fragment>
          )}
        </Formik>
        <View style={{flexDirection: 'row', flex: 'display', alignSelf: 'center', marginTop: 10}}>
        <Text style={{alignSelf: 'center', marginTop: 10, fontSize: 15}}> Have an account already? </Text>
          <TouchableHighlight
             onPress={this.goToLogin}
          ><Text style={styles.sign}>Login</Text></TouchableHighlight>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0CBCF',
    height: '100%',
    padding: '15%',
    paddingTop: '30%',


  },
  buttonContainer: {
    marginTop: '10%',
    backgroundColor: '#354A74',
    width: '45%',
    alignSelf: 'center',
    height: '10%',
    fontSize: 8,
    borderRadius: 30
  },
  button: {
    fontSize:15,
    color: 'white',
    alignSelf: 'center',
    padding: 10
  },
  input: {
    height: 5,
    marginBottom: 30,
    // width: '80%',
    alignSelf: 'center'
  },
  sign: {
    color: 'blue',
    alignSelf: 'center',
    paddingTop:10,
    fontSize:15
  },
})
