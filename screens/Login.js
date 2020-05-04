// CITATION: https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native'
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
      <SafeAreaView style={styles.container}>
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
                name='email'
                value={props.values.email}
                onChangeText={props.handleChange('email')}
                placeholder='Enter email'
                autoCapitalize='none'
                iconName='mail-forward'
                iconColor='#2C384A'
                onBlur={props.handleBlur('email')}
                autoFocus
              />
              <ErrorMessage errorValue={props.touched.email && props.errors.email} />
              <FormInput
                name='password'
                value={props.values.password}
                onChangeText={props.handleChange('password')}
                placeholder='Enter password'
                secureTextEntry
                iconName='lock'
                iconColor='#2C384A'
                onBlur={props.handleBlur('password')}
              />
              <ErrorMessage errorValue={props.touched.password && props.errors.password} />
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType='outline'
                  onPress={props.handleSubmit}
                  title='LOGIN'
                  buttonColor='#039BE5'
                  disabled={!props.isValid || props.isSubmitting}
                />
              </View>
            </Fragment>
          )}
        </Formik>
        <Button
          title="Don't have an account? Sign Up"
          onPress={this.goToSignup}
          titleStyle={{
            color: '#F57C00'
          }}
          type='clear'
        />
      </SafeAreaView>
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
    backgroundColor: '#fff'
  },
  buttonContainer: {
    margin: 25
  }
})
