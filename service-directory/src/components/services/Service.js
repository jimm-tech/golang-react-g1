import React, { Component, Fragment } from 'react'
import Timestamp from 'react-timestamp'
import _ from 'lodash'
import { Placeholder, Button, Card, Image, Icon, Container, Label, Rating } from 'semantic-ui-react'
import NoDisplay from '../NoDisplay'

class Service extends Component {

    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            open: false
        }
    }

    show = (card) => () => {
        this.setState({ open: true })
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
        const { cards, serviceType } = this.props

        let cardCount = 4
        if (serviceType === 'My Services') {
            cardCount = 3
        }

        return (
            <Fragment>
                {
                    (cards.length) > 0 ?
                        <Card.Group doubling itemsPerRow={cardCount} stackable>
                            {
                                _.map(cards, (card) => (
                                    <Card key={card._id}>
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
                                                            <Label attached='top' color='teal' content={card.price} />
                                                            <Card.Header content={card.title} />
                                                            <Card.Meta>
                                                                Posted: <Timestamp date={card.timestamp} />
                                                            </Card.Meta>
                                                            <Card.Description content={card.description} />
                                                            {
                                                                loading ? (
                                                                    <Placeholder />
                                                                ) : (
                                                                        <Container textAlign='center' style={{ padding: '0.5em' }}>
                                                                            {(card.image) !== '' ? <Image src={card.image} /> : <Icon size='massive' name='image' />}
                                                                        </Container>
                                                                    )
                                                            }
                                                        </Fragment>
                                                    )
                                            }
                                        </Card.Content>
                                        {
                                            (card.userid) === sessionStorage.getItem('_id') ?
                                                <Card.Content extra>
                                                    <Button disabled={loading} animated='vertical' fluid onClick={this.show(card)}>
                                                        <Button.Content hidden>Delete Service</Button.Content>
                                                        <Button.Content visible>
                                                            <Icon name='trash alternate' />
                                                        </Button.Content>
                                                    </Button>
                                                </Card.Content> :
                                                <Card.Content extra>
                                                    {
                                                        loading ? (
                                                            <Placeholder>
                                                                <Placeholder.Paragraph>
                                                                    <Placeholder.Line length='medium' />
                                                                </Placeholder.Paragraph>
                                                            </Placeholder>
                                                        ) :
                                                            <div>
                                                                <div>
                                                                    {(card.service_provider[0].image) !== '' ? <Image size='big' avatar src={card.service_provider[0].image} /> : <Icon name='user' />}
                                                                    {card.service_provider[0].firstname} {card.service_provider[0].lastname}
                                                                </div>
                                                                <div>
                                                                    <Rating icon='star' defaultRating={0} maxRating={5} disabled />
                                                                </div>
                                                            </div>
                                                    }
                                                </Card.Content>
                                        }
                                    </Card>
                                ))
                            }
                        </Card.Group> : <NoDisplay type={serviceType} />
                }
            </Fragment>
        )
    }
}

export default Service;
