import React from 'react'
import { Form, Image, Label } from 'semantic-ui-react'
import logo from '../../images/logo.png'
import axios from 'axios'
import './Register.css'
import { Redirect } from 'react-router-dom'

class Register extends React.Component {

  constructor(props) {
    super(props)
    this.clearDetails = this.clearDetails.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToWelcome = this.goToWelcome.bind(this)
    this.goToSignin = this.goToSignin.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.state = {
      isSuccess: false,
      redirect: null,
      email: '',
      domain: 'mnm',
      extension: 'com',
      password: '',
      firstname: '',
      lastname: '',
      type: this.props.name
    }
  }

  clearDetails = () => this.setState({
    redirect: null,
    email: '',
    domain: '',
    extension: '',
    password: '',
    firstname: '',
    lastname: '',
    type: this.props.name,
  })

  onChange = event => {
    if (event.target.name === 'extension' || event.target.name === 'domain') {
      this.setState({ [event.target.name]: event.target.value.replace(/[^a-z -]/gi, "") })
    } else {
      this.setState({ [event.target.name]: event.target.value.replace(/[^\w.\s]/gi, "") })
    }
  }
  goToWelcome = () => this.setState({ redirect: '/' })
  goToSignin = () => this.setState({ redirect: '/signin' })

  createAccount = () => {
    let { firstname, lastname, email, domain, extension, password, type } = this.state
    email = email + '@' + domain + '.' + extension
    if (firstname && lastname && email && password) {
      this.setState({ formStyle: 'loading' })
      axios
        .post(window.$endpoint + '/api/user', { firstname, lastname, email, password, type },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(res => {
          setTimeout(() => {
            this.setState({ formStyle: '', isSuccess: true })
            this.goToSignin()
          }, 2000)
        })
    }
  }

  render() {

    if (this.state.redirect && this.state.isSuccess === true) {
      return <Redirect to={{ pathname: this.state.redirect, state: { formStyle: 'success', messageHeader: 'MNM Account successfully created.' } }} />
    }

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div className='register-form'>
        <Image centered size='small' src={logo} onClick={this.goToWelcome} style={{ cursor: 'pointer' }} />
        <h2>Create your MNM {this.props.name} Account</h2>
        <p>to continue to Service Directory</p>
        <Form className={this.state.formStyle}>
          <Form.Group widths='equal'>
            <Form.Input
              label='Firt name'
              required
              type='text'
              name='firstname'
              onChange={this.onChange}
              value={this.state.firstname}
              placeholder='First name' />
            <Form.Input
              label='Last name'
              required
              type='text'
              name='lastname'
              onChange={this.onChange}
              value={this.state.lastname}
              placeholder='Last name' />
          </Form.Group>
          <Label style={{ marginBottom: '1em' }}
            content={'Email: ' + this.state.email + '@' + this.state.domain + '.' + this.state.extension}
            icon='mail' />
          <Form.Group>
            <Form.Input
              label='Email'
              required
              type='text'
              name='email'
              onChange={this.onChange}
              value={this.state.email}
              placeholder='Email'
              width={9} />
            <Form.Field style={{ paddingTop: '2em', paddingLeft: '0', paddingRight: '0' }}>
              <Label style={{ backgroundColor: '#ffffff', padding: '0' }} size='huge' content='@' />
            </Form.Field>
            <Form.Input style={{ paddingTop: '1.65em' }}
              required
              type='text'
              name='domain'
              onChange={this.onChange}
              value={this.state.domain}
              placeholder='Domain'
              width={3} />
            <Form.Field style={{ paddingTop: '2em', paddingLeft: '0', paddingRight: '0' }}>
              <Label style={{ backgroundColor: '#ffffff', padding: '0' }} size='huge' content='.' />
            </Form.Field>
            <Form.Input style={{ paddingTop: '1.65em' }}
              required
              type='text'
              name='extension'
              onChange={this.onChange}
              value={this.state.extension}
              placeholder='Ext'
              width={3} />
          </Form.Group>
          <Form.Input
              label='Password'
              required
              type='password'
              name='password'
              onChange={this.onChange}
              value={this.state.password}
              placeholder='Password' />
          <Form.Group widths='equal'>
            <Form.Field >
              <Label size='large' as='a' color='blue' onClick={this.goToSignin} style={{ fontWeight: 'normal', marginTop: '0.3em' }}>
                Sign In Instead
              </Label>
            </Form.Field>
            <Form.Button fluid color='green' onClick={this.createAccount}>Create Account</Form.Button>
          </Form.Group>
        </Form>
      </div >
    )
  }
}

export default Register;
