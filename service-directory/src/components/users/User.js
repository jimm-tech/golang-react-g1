import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import { Placeholder, Button, Card, Image, Icon, Container, Label, Rating, Modal, Item, Grid, Loader } from 'semantic-ui-react'
import NoDisplay from '../NoDisplay'
import axios from 'axios'

class User extends Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.show = this.show.bind(this)
        this.close = this.close.bind(this)
        this.showLoading = this.showLoading.bind(this)
        this.closeLoading = this.closeLoading.bind(this)
        this.deactivateAccount = this.deactivateAccount.bind(this)
        this.state = {
            loading: true,
            open: false,
            deactivateText: 'Deactivate',
            openLoading: false,
            selectedUserID: '',
            selectedUserType: '',
            selectedUserImage: '',
            selectedUserFirstname: '',
            selectedUserLastname: '',
            selectedUserEmail: '',
            selectedUserRating: 0
        }
    }

    showLoading = () => this.setState({ openLoading: true })
    show = (card) => () => {
        if (card.deleted) {
            this.setState({ deactivateText: 'Activate' })
        } else {
            this.setState({ deactivateText: 'Deactivate' })
        }
        this.setState({
            open: true,
            selectedUserID: card._id,
            selectedUserType: card.type,
            selectedUserImage: card.image,
            selectedUserFirstname: card.firstname,
            selectedUserLastname: card.lastname,
            selectedUserEmail: card.email,
            selectedUserRating: card.rating
        })
    }
    closeLoading = () => this.setState({ openLoading: false })
    close = () => this.setState({ open: false })
    deactivateAccount = () => {
        this.close()
        this.showLoading()
        let _id = this.state.selectedUserID
        if (_id) {
            let deleted = false
            if (this.state.deactivateText === 'Deactivate') {
                deleted = true
            }
            axios
                .put(window.$endpoint + '/api/deleteuser', { _id, deleted }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data) {
                        setTimeout(() => {
                            this.closeLoading()
                            this.props.action()
                        }, 2000)
                    }
                })
        }
    }

    componentDidMount() {
        this._isMounted = true
        setTimeout(() => {
            if (this._isMounted) {
                this.setState({ loading: false })
            }
        }, 3000)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        const { loading, open, openLoading } = this.state
        const { cards, userType } = this.props

        return (
            <Fragment>
                {
                    (cards.length) > 0 ?
                        <Card.Group doubling itemsPerRow={4} stackable>
                            {
                                _.map(cards, (card) => (
                                    <Card key={card._id}>
                                        {
                                            loading ? null : (
                                                <Container textAlign='center' style={{ padding: '0.5em' }}>
                                                    {
                                                        card.deleted === true ?
                                                            <Label attached='top left' as='a' color='red' tag>
                                                                DEACTIVATED
                                                        </Label> : null
                                                    }
                                                    {
                                                        (card.image) !== '' ?
                                                            <Image disabled={card.deleted} fluid rounded src={card.image} /> : <Icon size='massive' circular name='user' />
                                                    }
                                                </Container>
                                            )
                                        }
                                        <Card.Content>
                                            {
                                                loading ? (
                                                    <Placeholder>
                                                        <Placeholder.Header>
                                                            <Placeholder.Line length='very short' />
                                                            <Placeholder.Line length='medium' />
                                                        </Placeholder.Header>
                                                        <Placeholder.Paragraph>
                                                            <Placeholder.Line length='short' />
                                                        </Placeholder.Paragraph>
                                                    </Placeholder>
                                                ) : (
                                                        <Fragment>
                                                            <Card.Header content={card.firstname + ' ' + card.lastname} />
                                                            <Card.Meta>
                                                                {
                                                                    card.status === true ? <div><Label circular color='green' empty /> Online</div> :
                                                                        <div><Label circular color='red' empty /> Not online</div>
                                                                }
                                                            </Card.Meta>
                                                            <Card.Description content={card.email} />
                                                        </Fragment>
                                                    )
                                            }
                                            {
                                                (card.type) === 'Customer' ? null :
                                                    <div>
                                                        <br />
                                                        <Rating icon='star' defaultRating={0} maxRating={5} disabled />
                                                    </div>
                                            }
                                        </Card.Content>
                                        <Card.Content extra>
                                            {
                                                (card.deleted) === true ?
                                                    <div>
                                                        {
                                                            (card.status) === true ?
                                                                <Button disabled animated='vertical' fluid >
                                                                    <Button.Content hidden>Activate Account</Button.Content>
                                                                    <Button.Content visible>
                                                                        <Icon name='lock open' />
                                                                    </Button.Content>
                                                                </Button> :
                                                                <Button disabled={loading} animated='vertical' fluid onClick={this.show(card)}>
                                                                    <Button.Content hidden>Activate Account</Button.Content>
                                                                    <Button.Content visible>
                                                                        <Icon name='lock open' />
                                                                    </Button.Content>
                                                                </Button>
                                                        }
                                                    </div> :
                                                    <div>
                                                        {
                                                            (card.status) === true ?
                                                                <Button disabled animated='vertical' fluid >
                                                                    <Button.Content hidden>Deactivate Account</Button.Content>
                                                                    <Button.Content visible>
                                                                        <Icon name='lock' />
                                                                    </Button.Content>
                                                                </Button> :
                                                                <Button disabled={loading} animated='vertical' fluid onClick={this.show(card)}>
                                                                    <Button.Content hidden>Deactivate Account</Button.Content>
                                                                    <Button.Content visible>
                                                                        <Icon name='lock' />
                                                                    </Button.Content>
                                                                </Button>
                                                        }
                                                    </div>
                                            }
                                        </Card.Content>
                                    </Card>
                                ))
                            }
                        </Card.Group> : <NoDisplay type={userType} />
                }
                <Modal dimmer='blurring' size='mini' open={open} closeOnEscape={true} closeOnDimmerClick={false} onClose={this.close}>
                    <Modal.Header>{this.state.deactivateText} Selected Account?</Modal.Header>
                    <Modal.Content>
                        <Grid centered>
                            <Grid.Row>
                                <Grid.Column width={6} style={{ padding: '0' }}>
                                    {
                                        (this.state.selectedUserImage) !== '' ? <Image size='large' src={this.state.selectedUserImage} /> :
                                            <Icon size='huge' name='user' />
                                    }
                                </Grid.Column>
                                <Grid.Column width={9}>
                                    <Item>
                                        <Item.Content>
                                            <Item.Header as='a'>{this.state.selectedUserFirstname} {this.state.selectedUserLastname}</Item.Header>
                                            <Item.Meta>{this.state.selectedUserEmail}</Item.Meta>
                                            {
                                                (this.state.selectedUserType) === 'Customer' ? null :
                                                    <Item.Extra>
                                                        <Rating icon='star' defaultRating={this.state.selectedUserRating} maxRating={5} disabled />
                                                    </Item.Extra>
                                            }
                                        </Item.Content>
                                    </Item>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' inverted onClick={this.close} >
                            <Icon name='remove' /> No
                    </Button>
                        <Button color='green' inverted onClick={this.deactivateAccount} >
                            <Icon name='checkmark' /> Yes
                    </Button>
                    </Modal.Actions>
                </Modal>
                <Modal dimmer='blurring' basic open={openLoading} closeOnEscape={false} closeOnDimmerClick={false} onClose={this.closeLoading} >
                    <Modal.Content>
                        <Loader size='large' />
                    </Modal.Content>
                </Modal>
            </Fragment>
        )
    }
}

export default User;
