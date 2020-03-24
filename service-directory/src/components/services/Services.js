import React, { Component } from 'react'
import { Container, Header, Button, Grid, Card, Feed, Divider, Segment, Popup } from 'semantic-ui-react'
import axios from 'axios'
import Service from './Service'

class Services extends Component {

    constructor(props) {
        super(props)
        this.getAllServices = this.getAllServices.bind(this)
        this.getAllMyServices = this.getAllMyServices.bind(this)
        this.getAllOtherServices = this.getAllOtherServices.bind(this)
        this.state = {
            services: [],
            myservices: [],
            otherservices: []
        }
    }

    componentDidMount() {
        this.getAllServices()
        this.getAllMyServices()
        this.getAllOtherServices()
    }

    getAllServices = () => {
        axios
            .get(window.$endpoint + '/api/services')
            .then(res => {
                if (res.data) {
                    this.setState({ services: res.data })
                }
            })
    }

    getAllMyServices = () => {
        let userid = sessionStorage.getItem('_id')
        if (userid) {
            axios
                .get(window.$endpoint + '/api/myservices', { userid }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data) {
                        this.setState({ myservices: res.data })
                    }
                })
        }
    }

    getAllOtherServices = () => {
        let userid = sessionStorage.getItem('_id')
        if (userid) {
            axios
                .get(window.$endpoint + '/api/otherservices', { userid }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data) {
                        this.setState({ otherservices: res.data })
                    }
                })
        }
    }

    render() {

        let type = sessionStorage.getItem('type') !== null ? sessionStorage.getItem('type').toLowerCase() : ''
        if (type === 'admin') {
            return (
                <Container textAlign='center'>
                    <Service serviceType='Services' cards={this.state.services} />
                </Container>
            )
        } else if (type === 'customer') {
            return (
                <Container textAlign='center'>
                    <Service serviceType='Services' cards={this.state.services} />
                </Container>
            )
        } else {
            return (
                <Container textAlign='center'>
                    <Grid columns={2} style={{ padding: '0em' }}>
                        <Grid.Row style={{ padding: '0em' }}>
                            <Grid.Column width={3} style={{ padding: '0em' }}>
                                <Card style={{ minHeight: 275, marginTop: '1.5em' }}>
                                    <Card.Content>
                                        <Card.Header>Recent Requests</Card.Header>
                                        <Divider />
                                        <Feed>
                                        </Feed>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column width={13} >
                                <Popup content='Create new service' trigger={<Button compact circular icon='edit' size='massive' color='blue' floated='right' />} />
                                <Header as='h2' block>My Services</Header>
                                <Segment>
                                    <Service serviceType='My Services' cards={this.state.myservices} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16} style={{ padding: '0em' }}>
                                <Divider />
                                <Header as='h3' block>Other Services</Header>
                                <Segment>
                                    <Service serviceType='Other Services' cards={this.state.otherservices} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            )
        }
    }
}

export default Services;
