import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'
import { currentApprover } from '../function/Auth'

function ApproverRoute({ children }) {

    const { user } = useSelector((state) => ({ ...state }))
    const [ok, setOK] = useState(false)

    useEffect(() => {
        if (user && user.token) {
            currentApprover(user.token)
                .then(res => {
                    console.log(res.data)
                    setOK(true)
                })
                .catch(err => {
                    console.log(err)
                    setOK(false)
                })
        }

    }, [user])


    return ok
        ? children
        : <LoadingToRedirect />
}

export default ApproverRoute