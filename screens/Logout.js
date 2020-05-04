import React from 'react'
import {connect} from 'react-redux'
import {logout} from '../redux/redux'
import { bindActionCreators } from 'redux';

class Logout extends React.Component {
  constructor(props) {
      super(props);
   }

  componentDidMount() {
    console.log("LOGGING OUT")
    this.props.logout();
    console.log("DONE!")
    this.props.navigation.navigate('Home')
  }

  render() {
    return null
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  logout: () => logout()
}, dispatch)

export default connect(null, mapDispatchToProps)(Logout);