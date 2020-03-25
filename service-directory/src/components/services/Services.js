import React, { Component } from 'react'
import {
    Container, Header, Button, Grid, Card, Feed, Divider, Segment,
    Popup, Modal, Icon, Form
} from 'semantic-ui-react'
import CurrencyFormat from 'react-currency-format'
import axios from 'axios'
import Service from './Service'

class Services extends Component {

    constructor(props) {
        super(props)
        this.getAllServices = this.getAllServices.bind(this)
        this.getAllMyServices = this.getAllMyServices.bind(this)
        this.getAllOtherServices = this.getAllOtherServices.bind(this)
        this.showAddService = this.showAddService.bind(this)
        this.closeAddService = this.closeAddService.bind(this)
        this.onChange = this.onChange.bind(this)
        this.state = {
            services: [],
            myservices: [],
            otherservices: [],
            openAddService: false,
            savingService: false,
            formStyle: '',
            title: '',
            description: '',
            price: '',
            image: ''
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

    onChange = event => this.setState({ [event.target.name]: event.target.value })
    showAddService = () => this.setState({ openAddService: true })
    closeAddService = () => this.setState({ openAddService: false })
    handlePriceChange = (e, { name, value }) => this.setState({ [name]: value })
    createService = () => {
        let userid = sessionStorage.getItem('_id')
        if (userid) {
            this.setState({ formStyle: 'loading', savingService: true })
            let { title, description, price, image } = this.state
            axios
                .post(window.$endpoint + '/api/service', { userid, title, description, price, image },
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    setTimeout(() => {
                        if (res.data.success) {
                            this.closeAddService()
                        }
                    }, 2000)
                })
        }
    }

    render() {
        const { openAddService } = this.state

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
                            <Grid.Column width={16} >
                                <Popup position='bottom right' content='Create new service' trigger={<Button compact circular icon='edit' size='massive' color='blue' floated='right' onClick={this.showAddService} />} />
                                <Header as='h1'>My Services</Header>
                                <Segment>
                                    <Service serviceType='My Services' cards={this.state.myservices} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16} style={{ padding: '0em' }}>
                                <Divider />
                                <Header as='h2'>Other Services</Header>
                                <Segment>
                                    <Service serviceType='Other Services' cards={this.state.otherservices} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Modal size='small' dimmer='blurring' open={openAddService} closeOnEscape={true} closeOnDimmerClick={false} onClose={this.closeAddService} closeIcon>
                        <Header icon='tasks' content='Create a Service' />
                        <Modal.Content>
                            <Grid columns={2} divided style={{ paddingLeft: '2em', paddingRight: '2em' }}>
                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Form className={this.state.personalInformationLoading}>
                                            <Form.Input
                                                label='Title'
                                                required
                                                type='text'
                                                name='title'
                                                placeholder='Title'
                                                onChange={this.onChange}
                                                value={this.state.title} />
                                            <Form.TextArea
                                                rows={6}
                                                style={{ minHeight: 100 }}
                                                label='Description'
                                                required
                                                type='text'
                                                name='description'
                                                placeholder='Description'
                                                onChange={this.onChange}
                                                value={this.state.description} />
                                            <Form.Field required style={{ marginBottom: '0' }}>
                                                <label>Price</label>
                                                <CurrencyFormat
                                                    placeholder='₱ 0.00'
                                                    thousandSeparator={true}
                                                    prefix={'₱ '}
                                                    name='price'
                                                    onChange={this.onChange}
                                                    value={this.state.price} />
                                            </Form.Field>
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column width={5} >
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='green' onClick={this.createService}>
                                <Icon name='checkmark' />Create
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Container >
            )
        }
    }
}

export default Services;
