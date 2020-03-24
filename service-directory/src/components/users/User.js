import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import { Placeholder, Button, Card, Image, Icon, Container, Label, Rating, Modal, Item, Grid } from 'semantic-ui-react'
import NoDisplay from '../NoDisplay'

class User extends Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            open: false,
            selectedUserImage: '',
            selectedUserFirstname: '',
            selectedUserLastname: '',
            selectedUserEmail: '',
            selectedUserRating: 0
        }
    }

    show = (card) => () => {
        this.setState({
            open: true,
            selectedUserImage: card.image,
            selectedUserFirstname: card.firstname,
            selectedUserLastname: card.lastname,
            selectedUserEmail: card.email,
            selectedUserRating: card.rating
        })
    }
    close = () => this.setState({ open: false })

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
        const { loading, open } = this.state
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
                                                    {(card.image) !== '' ? <Image fluid circular src={card.image} /> : <Icon size='massive' circular name='user' />}
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
                                                                {card.status === true ? <div><Label circular color='green' empty /> Online</div> :
                                                                    <div><Label circular color='red' empty /> Not online</div>}
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
                                                (card.status) === true ?
                                                    <Button disabled animated='vertical' fluid >
                                                        <Button.Content hidden>Deactivate Account</Button.Content>
                                                        <Button.Content visible>
                                                            <Icon name='trash alternate' />
                                                        </Button.Content>
                                                    </Button> :
                                                    <Button disabled={loading} animated='vertical' fluid onClick={this.show(card)}>
                                                        <Button.Content hidden>Deactivate Account</Button.Content>
                                                        <Button.Content visible>
                                                            <Icon name='trash alternate' />
                                                        </Button.Content>
                                                    </Button>
                                            }
                                        </Card.Content>
                                    </Card>
                                ))
                            }
                        </Card.Group> : <NoDisplay type={userType} />
                }
                <Modal size='mini' open={open} closeOnEscape onClose={this.close}>
                    <Modal.Header>Deactivate Selected Account?</Modal.Header>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column width={4}>
                                    {
                                        (this.state.selectedUserImage) !== '' ? <Image size='tiny' src={this.state.selectedUserImage} /> :
                                            <Icon size='huge' name='user' />
                                    }
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Item>
                                        <Item.Content>
                                            <Item.Header as='a'>{this.state.selectedUserFirstname} {this.state.selectedUserLastname}</Item.Header>
                                            <Item.Meta>{this.state.selectedUserEmail}</Item.Meta>
                                            <Item.Extra>
                                                <Rating icon='star' defaultRating={this.state.selectedUserRating} maxRating={5} disabled />
                                            </Item.Extra>
                                        </Item.Content>
                                    </Item>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close} negative content='No' />
                        <Button onClick={this.close} positive content='Yes' />
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
}

export default User;
