import React, { Component } from 'react'
import { Form, Icon, Header, Segment, Label, Grid, Rating, Container, Image, Divider, Button, Message } from 'semantic-ui-react'
import axios from 'axios'

class MyProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstname: this.props.userData.firstname,
            lastname: this.props.userData.lastname,
            email: this.props.userData.email,
            image: this.props.userData.image,
            type: this.props.userData.type,
            oldPassword: '',
            confirmPassword: '',
            newPassword: '',
            profilePictureChanged: false,
            profilePictureUpload: false,
            profilePictureUpdateError: true,
            updateErrorTitle: '',
            personalInformationLoading: '',
            passwordLoading: ''
        }
        this.onPersonalInformationChange = this.onPersonalInformationChange.bind(this)
        this.triggerSelectProfilePicture = this.triggerSelectProfilePicture.bind(this)
        this.deleteAccount = this.deleteAccount.bind(this)
        this.onProfilePictureSelected = this.onProfilePictureSelected.bind(this)
        this.cancelProfilePictureUpdate = this.cancelProfilePictureUpdate.bind(this)
        this.saveProfilePictureUpdate = this.saveProfilePictureUpdate.bind(this)
    }

    componentDidMount() {
    }

    onPersonalInformationChange = event => this.setState({ [event.target.name]: event.target.value, personalInformationLoading: '' })
    onPasswordChange = event => this.setState({ [event.target.name]: event.target.value, passwordLoading: '' })
    triggerSelectProfilePicture = () => {
        this.profilePictureInput.click()
        this.setState({ profilePictureUpdateError: false })
    }

    onProfilePictureSelected = event => {
        var reader = new FileReader()
        let file = event.target.files[0]
        reader.onloadend = (theFile) => this.setState({ image: theFile.target.result, profilePictureChanged: true })
        reader.readAsDataURL(file)
    }

    cancelProfilePictureUpdate = () => this.setState({ image: undefined, profilePictureChanged: false })
    deleteAccount = () => {
        let _id = sessionStorage.getItem('_id')
        if (_id) {
            let deleted = true
            axios
                .put(window.$endpoint + '/api/deleteuser', { _id, deleted }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data) {
                        setTimeout(() => {
                            console.log(res.data)
                        }, 2000)
                    }
                })
        }
    }

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
                    console.log(res.data)
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

    render() {

        const { firstname, lastname, email, image, type } = this.state

        return (
            <Segment style={{ minHeight: 420 }}>
                <Label size='huge' color='blue' content='My Profile' icon='address card outline' ribbon />
                <Grid columns={3} divided style={{ paddingLeft: '2em', paddingRight: '2em' }}>
                    <Grid.Row stretched>
                        <Grid.Column width={5}>
                            {
                                (type).toLowerCase() === 'admin' ?
                                    <div>
                                        <Segment loading={this.state.profilePictureUpload} textAlign='center' style={{ padding: '0.5em', marginTop: '1em' }}>
                                            <Message negative hidden={this.state.profilePictureUpdateError} header={this.state.updateErrorTitle} content='Please try again later.' />
                                            {
                                                (image) !== undefined ?
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
                                                    </div> :
                                                    <Icon size='massive' circular name='user' />
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
                                    </div> :
                                    <div>
                                        <Grid.Row>
                                            <Grid centered columns={2}>
                                                <Grid.Row style={{ paddingTop: '1.5em', paddingBottom: '0em' }} verticalAlign='middle' centered>
                                                    <Container textAlign='center'>
                                                        {
                                                            (image) !== undefined ?
                                                                <Image style={{ margin: 'auto' }} size='small' src={image} rounded /> :
                                                                <Icon size='huge' circular name='user' />
                                                        }
                                                        <Button icon labelPosition='left' style={{ marginTop: '0.5em' }}>
                                                            <Icon name='pencil alternate' />Change Profle Picture
                                                        </Button>
                                                    </Container>
                                                </Grid.Row>
                                                {
                                                    (type).toLowerCase() === 'customer' ? <div style={{ margin: '0.5em' }} /> :
                                                        <Grid.Row>
                                                            <Rating size='huge' icon='star' defaultRating={0} maxRating={5} disabled />
                                                        </Grid.Row>
                                                }
                                            </Grid>
                                        </Grid.Row>
                                        {
                                            (type).toLowerCase() === 'admin' ? null :
                                                <Grid.Row>
                                                    <Divider style={{ padding: '0em', margin: '0.5em' }} />
                                                    <Header style={{ padding: '0em', margin: '0em' }} as='h3' color='red'>Delete Account</Header>
                                                    <Header style={{ marginTop: '0.5em' }} as='h5'>Once you delete your {type} account, there is no going back. Please be certain.</Header>
                                                    <Label size='large' color='red' as='a' basic onClick={this.deleteAccount} style={{ fontWeight: 'normal', marginTop: '0.3em' }}>Delete your account</Label>
                                                </Grid.Row>
                                        }
                                    </div>
                            }
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header as='h1'>Change Personal Information</Header>
                            <Form className={this.state.personalInformationLoading}>
                                <Message success header={this.state.updateErrorTitle} />
                                <Message error header={this.state.updateErrorTitle} content='Please try again later.' />
                                <Form.Input
                                    label='Email'
                                    required
                                    type='text'
                                    name='email'
                                    onChange={this.onPersonalInformationChange}
                                    value={this.state.email}
                                    placeholder='Email'
                                    defaultValue={email} />
                                <Form.Input
                                    label='Firt name'
                                    required
                                    type='text'
                                    name='firstname'
                                    onChange={this.onPersonalInformationChange}
                                    value={this.state.firstname}
                                    placeholder='First name'
                                    defaultValue={firstname} />
                                <Form.Input
                                    label='Last name'
                                    required
                                    type='text'
                                    name='lastname'
                                    onChange={this.onPersonalInformationChange}
                                    value={this.state.lastname}
                                    placeholder='Last name'
                                    defaultValue={lastname} />
                                <Form.Button color='blue' onClick={this.savePersonalInformationUpdate} >Update</Form.Button>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={5} >
                            <Header as='h1'>Change Password</Header>
                            <Form className={this.state.passwordLoading}>
                                <Message success header={this.state.updateErrorTitle} />
                                <Message error header={this.state.updateErrorTitle} content='Please try again later.' />
                                <Form.Input
                                    label='Old password'
                                    required
                                    type='password'
                                    name='old password'
                                    placeholder='Old password'
                                    onChange={this.onPasswordChange}
                                    value={this.state.oldPassword} />
                                <Form.Input
                                    label='Confirm password'
                                    required
                                    type='password'
                                    name='confirm password'
                                    placeholder='Confirm password'
                                    onChange={this.onPasswordChange}
                                    value={this.state.confirmPassword} />
                                <Form.Input
                                    label='New password'
                                    required
                                    type='password'
                                    name='new password'
                                    placeholder='New password'
                                    onChange={this.onPasswordChange}
                                    value={this.state.newPassword} />
                                <Form.Button color='blue' >Update</Form.Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment >
        )
    }
}

export default MyProfile;
