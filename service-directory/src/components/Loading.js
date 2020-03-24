import React from 'react'
import './Loading.css'
import logo from '../images/logo.png'

const Loading = () => (
  <div className='loading'>
    <div style={{ bottom: '0', left: '0', overflow: 'hidden', position: 'absolute', right: '0', top: '0' }}>
      <div style={{ animation: 'a-h .5s 1.25s 1 linear forwards,a-nt .6s 1.25s 1 cubic-bezier(0,0,.2,1)', background: '#eee', borderRadius: '50%', height: '800px', left: '50%', margin: '-448px -400px 0', position: 'absolute', top: '50%', transform: 'scale(0)', width: '800px' }} />
    </div>
    <div style={{ height: '100%', textAlign: 'center' }}>
      <div style={{ height: '50%', margin: '0 0 -130px' }}></div>
      <img style={{ animation: 'a-s .10s 0.50s 1 forwards', opacity: '0' }} className='mnm-logo' src={logo} alt='Logo' />
      <div className='nlpt'></div>
      <div style={{ animation: 'a-s .10s 0.50s 1 forwards', opacity: '0', fontWeight: '600', fontSize: '2.571em' }} className='title'>Service Directory</div>
    </div>
  </div >
)

export default Loading;
