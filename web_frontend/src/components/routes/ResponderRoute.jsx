import React from 'react'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'

function ResponderRoute({ children }) {

    const { user } = useSelector((state) => ({ ...state }))

    return user && user.token
        ? children
        : <LoadingToRedirect />
}

export default ResponderRoute