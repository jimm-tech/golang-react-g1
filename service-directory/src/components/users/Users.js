import React, { Component } from 'react'
import { Tab, Label, Menu } from 'semantic-ui-react'
import User from './User'
import axios from 'axios'

class Users extends Component {

    constructor(props) {
        super(props)
        this.getAllServiceProviders = this.getAllServiceProviders.bind(this)
        this.getAllCustomers = this.getAllCustomers.bind(this)
        this.state = {
            serviceProviders: [],
            customers: []
        }
    }

    componentDidMount() {
        this.getAllServiceProviders()
        this.getAllCustomers()
    }

    getAllServiceProviders = () => {
        axios
            .get(window.$endpoint + '/api/serviceproviders')
            .then(res => {
                if (res.data) {
                    this.setState({ serviceProviders: res.data })
                }
            })
    }

    getAllCustomers = () => {
        axios
            .get(window.$endpoint + '/api/customers')
            .then(res => {
                if (res.data) {
                    this.setState({ customers: res.data })
                }
            })
    }

    render() {

        const panes = [
            {
                menuItem: (
                    <Menu.Item key='serviceproviders'>
                        Service Providers<Label>{this.state.serviceProviders.length}</Label>
                    </Menu.Item>
                ),
                render: () => (
                    <Tab.Pane style={{ padding: '2em', minHeight: 370 }}>
                        <User action={this.getAllServiceProviders} userType='Service Providers' cards={this.state.serviceProviders} />
                    </Tab.Pane>
                )
            },
            {
                menuItem: (
                    <Menu.Item key='customers'>
                        Customers<Label>{this.state.customers.length}</Label>
                    </Menu.Item>
                ),
                render: () => (
                    <Tab.Pane style={{ padding: '2em', minHeight: 370 }}>
                        <User action={this.getAllCustomers} userType='Customers' cards={this.state.customers} />
                    </Tab.Pane>
                )
            }
        ]

        return (<Tab panes={panes} />)
    }
}

export default Users;
