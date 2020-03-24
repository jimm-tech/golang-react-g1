import React, { Component } from 'react'
import { Segment, Header, Image } from 'semantic-ui-react'

class NoDisplay extends Component {

    render() {

        return (
            <Segment basic size='large' textAlign='center'>
                <Header as='h1'>There is no {this.props.type} to display.</Header>
                <Image centered size='large' style={{ marginTop: '1.0em' }}
                    src='https://react.semantic-ui.com/images/wireframe/centered-paragraph.png'
                />
            </Segment>
        )
    }
}

export default NoDisplay;
