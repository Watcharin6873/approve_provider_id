import React from 'react'
import img_logo from '../../assets/Plogo-f6506bc1.png'

function Logo() {
  return (
    <div className='logo' >
        <div className='logo-icon'>
            <img src={img_logo} alt='logo' style={{width: '80px', marginTop: '0px'}} />
        </div>
    </div>
  )
}

export default Logo