import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  BrowserRouter,
  Routes,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {currentResponder} from './components/function/Auth'
import ApproverRoute from './components/routes/ApproverRoute'
import ResponderRoute from './components/routes/ResponderRoute'
import Login from './components/pages/auth/Login';
import HomeResponder from './components/pages/responder/HomeResponder'
import HomeApprover from './components/pages/approver/HomeApprover'
import AddRequest from './components/pages/responder/AddRequest';
import AddToken from './components/pages/approver/AddToken';
import AddUsers from './components/pages/responder/AddUsers';

function App() {
  const idtoken = localStorage.token
  const dispatch = useDispatch()

  if (idtoken) {
    currentResponder(idtoken)
      .then(res =>{
        dispatch({
          type: 'LOGIN',
          payload:{
            token: idtoken,
            hospital_code: res.data[0].hospital_code,
            username: res.data[0].username,
            fullname: res.data[0].fullname,
            level: res.data[0].level
          }
        })
      })
      .catch(err =>{
        console.log(err)
      })
  }

  return (
    <>
      <BrowserRouter basename='/approve_provider_id/'>
        <Routes>
          <Route path='/' element={<Login />} />
          {/* Responder Page */}
          <Route path='/responder' element={<ResponderRoute><HomeResponder /></ResponderRoute>} />
          <Route path='/responder/add-request-provider' element={<ResponderRoute><AddRequest /></ResponderRoute>} />
          <Route path='/responder/add-users' element={<ResponderRoute><AddUsers /></ResponderRoute>} />
          {/* Approver Page */}
          <Route path='/approver' element={<ApproverRoute><HomeApprover /></ApproverRoute>} />
          <Route path='/approver/add-token' element={<ApproverRoute><AddToken /></ApproverRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
