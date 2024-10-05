import axios from "axios";


//Create User
export const createUser = async (token, values) =>
    await axios.post(import.meta.env.VITE_APP_API+'/createUser', values,
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ token
            }
        }
    )

//Get List User
export const getListUsers = async (token) =>
    await axios.get(import.meta.env.VITE_APP_API + '/getListUsers',
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ token
            }
        }
    )


//Get User By ID
export const getUserByID = async (token, id) =>
    await axios.get(import.meta.env.VITE_APP_API + '/getUserByID/'+ id,
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ token
            }
        }
    )


//Update users
export const updateUser = async(token, id, values)=>
    await axios.put(import.meta.env.VITE_APP_API+'/updateUser/'+id, values,
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ token
            }
        }
    )


//Reset Password
export const resetPassword = async(token, id, values)=>
    await axios.put(import.meta.env.VITE_APP_API+'/resetPassword/'+id, values,
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ token
            }
        }
    )


//Login
export const login = async (values) =>
    await axios.post(import.meta.env.VITE_APP_API+'/login', values)


//Current User
export const currentResponder = async (token) =>
    await axios.post(import.meta.env.VITE_APP_API+'/currentResponder',
        {},
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//Current Approver
export const currentApprover = async (token) =>
    await axios.post(import.meta.env.VITE_APP_API+'/currentApprover',
        {},
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )