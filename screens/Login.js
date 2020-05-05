// CITATION: https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Alert, Text, TouchableHighlight} from 'react-native'
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {login} from '../redux/redux'
import {Card} from 'native-base'


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must be at least 6 characters '),
})

class Login extends React.Component {
  goToSignup = () => this.props.navigation.navigate('Signup')

  // storeData = async (data) => {
  //   try {
  //     await AsyncStorage.setItem('@user', JSON.stringify(data.user))
  //     // localStorage.set(JSON.string('token', data.token)
  //     // createCookie('token' data.token);
  //     // await AsyncStorage.setItem('@token', JSON.stringify(data.token))
  //   } catch (e) {
  //     console.log("error setting user", e)
  //   }
  // }

  componentDidUpdate(prevProps, prevState)  {
    // means we updated redux store with the user and have successfully logged in
    if (prevProps.user !== this.props.user) {
      console.log("REDIRECTING TO HOME")
      this.props.navigation.navigate('Home')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Card style={{marginTop: 100, paddingTop: 20, paddingBottom: 20, marginLeft: -20, marginRight: -20, borderRadius: "10px"}}>
          <Formik

            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              if (values.email.length > 0 && values.password.length > 0) {
                console.log("TRYING TO LOG IN")
                this.props.loginUser(values.email, values.password, "")
              }
            }}
            >
            {props => (
              <Fragment>
                <FormInput
                  containerStyle={styles.input}
                  name='email'
                  value={props.values.email}
                  onChangeText={props.handleChange('email')}
                  placeholder='Email'
                  autoCapitalize='none'
                  iconName='mail-forward'
                  iconColor='#2C384A'
                  onBlur={props.handleBlur('email')}
                  autoFocus

                />
                <ErrorMessage errorValue={props.touched.email && props.errors.email} />
                <FormInput
                containerStyle={styles.input}
                  name='password'
                  value={props.values.password}
                  onChangeText={props.handleChange('password')}
                  placeholder='Password'
                  secureTextEntry
                  iconName='lock'
                  iconColor='#2C384A'
                  onBlur={props.handleBlur('password')}
                />
                <ErrorMessage errorValue={props.touched.password && props.errors.password}/>

                <View style={styles.buttonContainer}>
                  <TouchableHighlight
                    onPress={props.handleSubmit}
                    disabled={!props.isValid || props.isSubmitting}
                  ><Text style={styles.button}>Login</Text></TouchableHighlight>
                </View>

              </Fragment>
            )}
          </Formik>
          <View style={{flexDirection: 'row', flex: 'display', alignSelf: 'center', marginTop: -10}}>
            <Text style={{alignSelf: 'center', marginTop: 10, fontSize: 15}}> Don't have an account? </Text>
            <TouchableHighlight
              onPress={this.goToSignup}
            ><Text style={styles.sign}>Sign Up</Text></TouchableHighlight>
          </View>
        </Card>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  loginUser: (email, password) => login(email, password)
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0CBCF',
    height: '100%',
    padding: '15%',
    paddingTop: '30%'
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
  },
  sign: {
    color: 'blue',
    alignSelf: 'center',
    paddingTop:10,
    fontSize:15
  },
  input: {
    height: 5,
    marginBottom: 30
  }
})
