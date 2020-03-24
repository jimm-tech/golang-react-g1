import React from 'react'
import './Home.css'
import { Container, Dropdown, Image, Menu, Icon, Segment, Header } from 'semantic-ui-react'
import logo from '../../images/logo.png'
import { Redirect } from 'react-router-dom'
import { animateScroll as scroll } from 'react-scroll'
import Loading from '../../components/Loading'
import axios from 'axios'
import Footer from '../../components/Footer'
import Services from '../../components/services/Services'
import Users from '../../components/users/Users'
import MyProfile from '../../components/myprofile/MyProfile'

class Home extends React.Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.scrollToTop = this.scrollToTop.bind(this)
        this.goToWelcome = this.goToWelcome.bind(this)
        this.clearDetails = this.clearDetails.bind(this)
        this.signOutAccount = this.signOutAccount.bind(this)
        this.handleItemClick = this.handleItemClick.bind(this)
        this.state = {
            userData: this.props.location.state ? this.props.location.state.userData : null,
            splashAnimate: true,
            activeItem: ''
        }
    }

    componentDidMount() {
        this._isMounted = true
        setTimeout(() => {
            if (this._isMounted) {
                this.setState({ splashAnimate: false })
                let type = sessionStorage.getItem('type') !== null ? sessionStorage.getItem('type').toLowerCase() : ''
                if (type === 'admin') {
                    this.setState({ activeItem: 'users' })
                } else {
                    this.setState({ activeItem: 'services' })
                }
            }
        }, 9000)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    scrollToTop() { scroll.scrollToTop() }
    goToWelcome = () => this.setState({ redirect: '/' })
    clearDetails = () => this.setState({ userData: null, redirect: null })

    signOutAccount = () => {
        let _id = sessionStorage.getItem('_id')
        if (_id) {
            axios
                .put(window.$endpoint + '/api/logout', { _id }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data.success) {
                        sessionStorage.clear()
                        this.goToWelcome()
                    }
                })
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {

        if (sessionStorage.getItem('isloggedin') === null || sessionStorage.getItem('isloggedin') === false) {
            return <Redirect to='/' />
        }

        if (this.state.splashAnimate) {
            return <Loading />
        }

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const { activeItem, userData } = this.state

        let menuItems
        let type = sessionStorage.getItem('type') !== null ? sessionStorage.getItem('type').toLowerCase() : ''
        if (type === 'admin') {
            menuItems = (
                <Menu.Menu position='left' style={{ marginLeft: '0.5em' }}>
                    <Menu.Item name='users' active={activeItem === 'users'} onClick={this.handleItemClick}>
                        <Icon size='big' name='users' /> Users
                    </Menu.Item>
                    <Menu.Item name='services' active={activeItem === 'services'} onClick={this.handleItemClick}>
                        <Icon size='big' name='tasks' /> Services
                    </Menu.Item>
                </Menu.Menu>
            )
        } else {
            menuItems = (
                <Menu.Menu position='left' style={{ marginLeft: '0.5em' }}>
                    <Menu.Item name='services' active={activeItem === 'services'} onClick={this.handleItemClick}>
                        <Icon size='big' name='home' /> Home
                    </Menu.Item>
                </Menu.Menu>
            )
        }

        let body
        if (this.state.activeItem === 'myprofile') {
            body = <MyProfile userData={userData} />
        } else if (this.state.activeItem === 'services') {
            body = <Services />
        } else if (this.state.activeItem === 'users') {
            body = <Users />
        }

        return (
            <div>
                <Segment textAlign='center' style={{ minHeight: 70, padding: '1em 0em' }} vertical>
                    <Menu fixed='top' size='large' borderless inverted>
                        <Container>
                            <Image src={logo} size='small' onClick={this.scrollToTop} />
                            {menuItems}
                            <Menu.Menu position='right'>
                                <Menu.Item style={{ padding: '0em' }}>
                                    <Header as='h2' inverted style={{ marginTop: '0.5em', marginRight: '0.5em' }}>Welcome </Header>
                                    {sessionStorage.getItem('image') !== 'undefined' ? <Image size='mini' src={sessionStorage.getItem('image')} avatar /> : <Icon style={{ margin: '0em' }} size='big' name='user circle' />}
                                </Menu.Item>
                                <Dropdown style={{ paddingTop: '1.5em', paddingLeft: '0.5em', paddingRight: '0.5em' }} text={sessionStorage.getItem('firstname') ? sessionStorage.getItem('firstname') + ' ' + sessionStorage.getItem('lastname') : 'Visitor'} pointing className='link item'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item name='myprofile' onClick={this.handleItemClick}>
                                            <Icon size='small' name='address card' />My Profile
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={this.signOutAccount}>
                                            <Icon size='small' name='sign-out' />Sign out
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>
                        </Container>
                    </Menu>
                </Segment>
                <div style={{ backgroundColor: '#e1e1e1', paddingLeft: '5em', paddingRight: '5em', paddingTop: '1.5em', paddingBottom: '1.5em', minHeight: 460 }}>
                    {body}
                </div>
                <Footer />
            </div>
        )
    }
}

export default Home;
