import React, { Component } from 'react'
import { Form, Icon, Header, Segment, Label, Grid, Rating, Container, Image, Divider, Button, Message } from 'semantic-ui-react'
import axios from 'axios'

class MyProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstname: sessionStorage.getItem('firstname'),
            lastname: sessionStorage.getItem('lastname'),
            email: sessionStorage.getItem('email'),
            image: sessionStorage.getItem('image'),
            type: sessionStorage.getItem('type'),
            oldpassword: '',
            confirmpassword: '',
            newpassword: '',
            profilePictureChanged: false,
            profilePictureUpload: false,
            profilePictureUpdateError: true,
            updateErrorTitle: '',
            personalInformationLoading: '',
            passwordLoading: ''
        }
        this.onPersonalInformationChange = this.onPersonalInformationChange.bind(this)
        this.triggerSelectProfilePicture = this.triggerSelectProfilePicture.bind(this)
        this.onProfilePictureSelected = this.onProfilePictureSelected.bind(this)
        this.cancelProfilePictureUpdate = this.cancelProfilePictureUpdate.bind(this)
        this.saveProfilePictureUpdate = this.saveProfilePictureUpdate.bind(this)
        this.savePasswordUpdate = this.savePasswordUpdate.bind(this)
    }

    onPersonalInformationChange = event => this.setState({ [event.target.name]: event.target.value, personalInformationLoading: '' })
    onPasswordChange = event => this.setState({ [event.target.name]: event.target.value, passwordLoading: '' })
    triggerSelectProfilePicture = () => this.profilePictureInput.click()

    onProfilePictureSelected = event => {
        var reader = new FileReader()
        let file = event.target.files[0]
        reader.onloadend = (theFile) => this.setState({ image: theFile.target.result, profilePictureChanged: true })
        reader.readAsDataURL(file)
    }

    cancelProfilePictureUpdate = () => this.setState({ image: undefined, profilePictureChanged: false })
    saveProfilePictureUpdate = () => {
        let _id = sessionStorage.getItem('_id')
        let { image } = this.state
        if (_id && image) {
            this.setState({ profilePictureUpload: true })
            axios
                .put(window.$endpoint + '/api/profilepicture', { _id, image }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data) {
                        setTimeout(() => {
                            if (res.data.success) {
                                sessionStorage.setItem('image', res.data.data)
                                this.setState({ image: res.data.data })
                                this.props.action()
                            } else {
                                this.setState({ updateErrorTitle: res.data.message, profilePictureUpdateError: false })
                            }
                            this.setState({ profilePictureUpload: false, profilePictureChanged: false })
                        }, 2000)
                    }
                })
        }
    }

    savePersonalInformationUpdate = () => {
        let _id = sessionStorage.getItem('_id')
        let { firstname, lastname, email } = this.state
        if (_id && firstname && lastname && email) {
            this.setState({ personalInformationLoading: 'loading' })
            axios
                .put(window.$endpoint + '/api/personalinformation', { _id, firstname, lastname, email }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data) {
                        setTimeout(() => {
                            if (res.data.success) {
                                sessionStorage.setItem('email', res.data.userdata.email)
                                sessionStorage.setItem('firstname', res.data.userdata.firstname)
                                sessionStorage.setItem('lastname', res.data.userdata.lastname)
                                this.setState({ personalInformationLoading: 'success' })
                            } else {
                                this.setState({ personalInformationLoading: 'error' })
                            }
                            this.setState({ updateErrorTitle: res.data.message })
                        }, 2000)
                    }
                })
        }
    }

    savePasswordUpdate = () => {
        let userid = sessionStorage.getItem('_id')
        let { oldpassword, confirmpassword, newpassword } = this.state
        if (userid && oldpassword && confirmpassword && newpassword) {
            this.setState({ passwordLoading: 'loading' })
            if (oldpassword !== confirmpassword) {
                this.setState({ passwordLoading: 'error', updateErrorTitle: 'Tne Confirm Password confirmation does not match.' })
            }
            else if (oldpassword === newpassword) {
                this.setState({ passwordLoading: 'error', updateErrorTitle: 'Your New Password cannot be the same as your current password.' })
            } else {
                axios
                    .put(window.$endpoint + '/api/updatepassword', { userid, oldpassword, newpassword }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                    .then(res => {
                        if (res.data) {
                            setTimeout(() => {
                                if (res.data.success) {
                                    this.setState({ passwordLoading: 'success' })
                                } else {
                                    this.setState({ passwordLoading: 'error' })
                                }
                                this.setState({ updateErrorTitle: res.data.message })
                            }, 2000)
                        }
                    })
            }
        }
    }

    render() {

        let { image, type } = this.state

        return (
            <Segment style={{ minHeight: 420 }}>
                <Label size='huge' color='blue' content='My Profile' icon='address card outline' ribbon />
                <Grid columns={3} divided style={{ paddingLeft: '2em', paddingRight: '2em' }}>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <div>
                                <Segment loading={this.state.profilePictureUpload} textAlign='center' style={{ padding: '0.5em', marginTop: '1em' }}>
                                    <Message negative hidden={this.state.profilePictureUpdateError} header={this.state.updateErrorTitle} />
                                    {
                                        image === '' || image === 'undefined' ?
                                            <Icon size='massive' circular name='user' /> :
                                            <div>
                                                <Image fluid rounded src={image} bordered />
                                                {
                                                    (this.state.profilePictureChanged) === true ?
                                                        <Button.Group attached>
                                                            <Button onClick={this.cancelProfilePictureUpdate}>Cancel</Button>
                                                            <Button.Or />
                                                            <Button color='blue' onClick={this.saveProfilePictureUpdate}>Update</Button>
                                                        </Button.Group> : null
                                                }
                                            </div>

                                    }
                                    <Divider style={{ marginBottom: '0em' }} />
                                    <div style={{
                                        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                                    }}>
                                        <Button fluid icon labelPosition='left' style={{ marginTop: '0.5em' }} onClick={this.triggerSelectProfilePicture}>
                                            <Icon name='pencil alternate' />Change Profle Picture
                                                </Button>
                                        <input ref={profilePictureInput => this.profilePictureInput = profilePictureInput} type='file' accept='image/*'
                                            onChange={this.onProfilePictureSelected} style={{ opacity: '0', position: 'absolute', zIndex: '-1' }} />
                                    </div>
                                </Segment>
                                {
                                    (type).toLowerCase() === 'customer' ? <div style={{ margin: '0.5em' }} /> :
                                        <Container textAlign='center'>
                                            <Rating size='massive' icon='star' defaultRating={0} maxRating={5} disabled />
                                        </Container>
                                }
                            </div>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header as='h1'>Change Personal Information</Header>
                            <Form className={this.state.personalInformationLoading}>
                                <Message success header={this.state.updateErrorTitle} />
                                <Message error header={this.state.updateErrorTitle} />
                                <Form.Input
                                    label='Email'
                                    required
                                    type='text'
                                    name='email'
                                    onChange={this.onPersonalInformationChange}
                                    value={this.state.email}
                                    placeholder='Email' />
                                <Form.Input
                                    label='Firt name'
                                    required
                                    type='text'
                                    name='firstname'
                                    onChange={this.onPersonalInformationChange}
                                    value={this.state.firstname}
                                    placeholder='First name' />
                                <Form.Input
                                    label='Last name'
                                    required
                                    type='text'
                                    name='lastname'
                                    onChange={this.onPersonalInformationChange}
                                    value={this.state.lastname}
                                    placeholder='Last name' />
                                <Form.Button color='blue' onClick={this.savePersonalInformationUpdate} >Update</Form.Button>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={5} >
                            <Header as='h1'>Change Password</Header>
                            <Form className={this.state.passwordLoading}>
                                <Message success header={this.state.updateErrorTitle} />
                                <Message error header={this.state.updateErrorTitle} />
                                <Form.Input
                                    label='Current password'
                                    required
                                    type='password'
                                    name='oldpassword'
                                    placeholder='Current password'
                                    onChange={this.onPasswordChange}
                                    value={this.state.oldpassword} />
                                <Form.Input
                                    label='Confirm password'
                                    required
                                    type='password'
                                    name='confirmpassword'
                                    placeholder='Confirm password'
                                    onChange={this.onPasswordChange}
                                    value={this.state.confirmpassword} />
                                <Form.Input
                                    label='New password'
                                    required
                                    type='password'
                                    name='newpassword'
                                    placeholder='New password'
                                    onChange={this.onPasswordChange}
                                    value={this.state.newpassword} />
                                <Form.Button color='blue' onClick={this.savePasswordUpdate} >Update</Form.Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment >
        )
    }
}

export default MyProfile;
