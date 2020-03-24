import React from 'react'
import './Signin.css'
import { Redirect, Link } from 'react-router-dom'
import logo from '../../images/logo.png'
import { Form, Image, Message } from 'semantic-ui-react'
import axios from 'axios'

class Signin extends React.Component {

  constructor(props) {
    super(props)
    this.clearDetails = this.clearDetails.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToHome = this.goToHome.bind(this)
    this.goToWelcome = this.goToWelcome.bind(this)
    this.signInAccount = this.signInAccount.bind(this)
    this.state = {
      redirect: null,
      userData: '',
      email: '',
      password: '',
      formStyle: this.props.location.state ? this.props.location.state.formStyle : '',
      messageHeader: this.props.location.state ? this.props.location.state.messageHeader : '',
      messageContent: this.props.location.state ? this.props.location.state.messageContent : ''
    }
  }

  clearDetails = () => this.setState({
    redirect: null,
    userData: '',
    email: '',
    password: '',
    formStyle: '',
    messageHeader: '',
    messageContent: ''
  })

  onChange = event => this.setState({ [event.target.name]: event.target.value, formStyle: '' })
  goToWelcome = () => this.setState({ redirect: '/' })
  goToHome = data => {
    sessionStorage.setItem('_id', data._id)
    sessionStorage.setItem('firstname', data.firstname)
    sessionStorage.setItem('lastname', data.lastname)
    sessionStorage.setItem('type', data.type)
    sessionStorage.setItem('image', data.image)
    sessionStorage.setItem('email', data.email)
    this.setState({ redirect: '/home', userData: data })
  }

  signInAccount = () => {
    let { email, password } = this.state
    if (email && password) {
      this.setState({ formStyle: 'loading' })
      axios
        .post(window.$endpoint + '/api/login', { email, password }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(res => {
          if (res.data._id === '000000000000000000000000') {
            this.setState({ formStyle: 'error', messageHeader: 'Invalid Credential', messageContent: 'Could not find your MNM Account.' })
          }
          else {
            setTimeout(() => {
              sessionStorage.setItem('isloggedin', true)
              this.setState({ formStyle: '' })
              this.goToHome(res.data)
            }, 2000)
          }
        })
    }
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={{ pathname: this.state.redirect, state: { userData: this.state.userData } }} />
    }

    return (
      <div className='signin-form'>
        <Image centered size='small' src={logo} onClick={this.goToWelcome} style={{ cursor: 'pointer' }} />
        <h2>Sign In</h2>
        <p>to continue to Service Directory</p>
        <Form className={this.state.formStyle}>
          <Message error header={this.state.messageHeader} content={this.state.messageContent} />
          <Form.Input
            label='Email'
            required
            icon='user'
            iconPosition='left'
            type='text'
            name='email'
            onChange={this.onChange}
            value={this.state.email}
            placeholder='Email' />
          <Form.Input
            label='Password'
            required
            icon='lock'
            iconPosition='left'
            type='password'
            name='password'
            onChange={this.onChange}
            value={this.state.password}
            placeholder='Password' />
          <Form.Button fluid color='green' onClick={this.signInAccount}>Sign In</Form.Button>
          <div style={{ margin: '15px', textAlign: 'center' }}>
            <div className='dropdown'>
              <span>Create Account</span>
              <div className='dropdown-content'>
                <Link to='/register/customer'>
                  <p>Customer</p>
                </Link>
                <Link to='/register/serviceprovider'>
                  <p>Service Provider</p>
                </Link>
              </div>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default Signin;
