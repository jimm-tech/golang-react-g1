import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import Signin from './pages/signin/Signin'
import Register from './pages/register/Register'
import Home from './pages/home/Home'
import Welcome from './pages/welcome/Welcome'
import './index.css'

window.$endpoint = 'http://localhost:8080' //global variable

const routing = (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Welcome} />
            <Route path='/home' component={Home} />
            <Route path='/signin' component={Signin} />
            <Route path='/register/customer' component={() => <Register name='Customer' />} />
            <Route path='/register/serviceprovider' component={() => <Register name='Service Provider' />} />
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
