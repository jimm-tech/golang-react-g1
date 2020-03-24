import './Welcome.css'
import React from 'react'
import { Button, Container, Grid, Header, Icon, Image, Menu, Segment } from 'semantic-ui-react'
import { Link, Element, animateScroll as scroll } from 'react-scroll'
import { Redirect, Link as GoToLink } from 'react-router-dom'
import logo from '../../images/logo.png'
import bgWelcome from '../../images/bg-welcome.jpg'
import bgDownload from '../../images/bg-download.jpg'
import logoGoogle from '../../images/driver-app-download_google-play_iOS.png'
import logoApple from '../../images/driver-app-download_app-store_iOS.png'
import Footer from '../../components/Footer'

class Welcome extends React.Component {

    constructor(props) {
        super(props)
        this.scrollToTop = this.scrollToTop.bind(this)
        this.goToSignin = this.goToSignin.bind(this)
        this.state = {
            redirect: null
        }
    }

    scrollToTop() { scroll.scrollToTop()}
    goToSignin = () => this.setState({ redirect: '/signin' })

    render() {

        if (sessionStorage.getItem('isloggedin') === 'true') {
            return <Redirect to='/home' />
        }

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        return (
            <div>
                <Segment textAlign='center' style={{ minHeight: 700, padding: '1em 0em', backgroundImage: `url(${bgWelcome})`, backgroundSize: 'cover' }} vertical>
                    <Menu fixed='top' size='large'>
                        <Container>
                            <Image src={logo} size='small' onClick={this.scrollToTop} />
                            <Menu.Item position='right'>
                                <GoToLink to='/register/serviceprovider'>
                                    <Button color='blue'>Become a Service Provider</Button>
                                </GoToLink>
                                <Link to='accountType' spy={true} smooth={true} duration={500} style={{ marginLeft: '2.5em' }}>
                                    <Button inverted primary={true}>Sign Up</Button>
                                </Link>
                                <Button inverted color='green' style={{ marginLeft: '0.5em' }} onClick={this.goToSignin}>Sign in</Button>
                            </Menu.Item>
                        </Container>
                    </Menu>
                    <Header as='h1' color='yellow' style={{ fontWeight: '600', marginTop: '6.5em', textShadow: '1px 1px #000000', fontSize: '3em' }}>Boost productivity with MNM Service Directory</Header>
                </Segment>
                <Element name='accountType' />
                <Segment textAlign='center' style={{ padding: '5em', paddingTop: '6em', border: '0em' }} vertical>
                    <Header as='h2' color='blue' style={{ fontWeight: '600', fontSize: '2.571em' }}> What type of MNM account can you become? </Header>
                    <Grid style={{ paddingTop: '3em' }}>
                        <Grid.Column floated='right' width={5}>
                            <Header as='h2' icon>
                                <Icon name='tasks' />Service Provider
                                    <Header.Subheader>
                                    <br />Freedom to own your time.<br /><br />
                                </Header.Subheader>
                            </Header>
                            <GoToLink to='/register/serviceprovider'>
                                <Button size='huge' inverted color='green'>I'm in, sign me up!</Button>
                            </GoToLink>
                        </Grid.Column>
                        <Grid.Column floated='left' width={5}>
                            <Header as='h2' icon>
                                <Icon name='edit' />Customer
                                    <Header.Subheader>
                                    <br />See all the available services in one place. Manage payments with ease.
                                    </Header.Subheader>
                            </Header>
                            <GoToLink to='/register/customer'>
                                <Button size='huge' inverted color='blue'>I want to create an account!</Button>
                            </GoToLink>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment textAlign='center' style={{ minHeight: 400, width: '100%', height: '100%', backgroundImage: `url(${bgDownload})`, padding: '5em' }} vertical>
                    <Header as='h1' inverted style={{ marginTop: '2.5em' }}>Download The MNM Service Directory App Now!</Header>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column floated='right' width={5}>
                                <Image className='app-store' size='medium' src={logoGoogle} />
                            </Grid.Column>
                            <Grid.Column>
                                <Image className='app-store' size='medium' src={logoApple} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Footer />
            </div>
        )
    }
}

export default Welcome;
