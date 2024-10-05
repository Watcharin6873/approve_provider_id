import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoadingToRedirect() {

    const navigate = useNavigate()
    const [count, setCount] = useState(3)

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((currentCount)=> --currentCount)
        }, 1000)

        //Redirect
        count === 0 && navigate('/')

        return ()=> clearInterval(interval)
    })

  return (
    <>
        <h4 className='text-center'>No permission, your redirect in {count}</h4>
    </>
  )
}

export default LoadingToRedirect