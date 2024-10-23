import axios from "axios";


//Create User
export const createUser = async (token, values) =>
    await axios.post(import.meta.env.VITE_APP_API + '/createUser', values,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//CreateUser by ProviderID
export const createUserByProviderID = async (values) =>
    await axios.post(import.meta.env.VITE_APP_API + '/createUserByProviderID', values)


//Get List User
export const getListUsers = async (token) =>
    await axios.get(import.meta.env.VITE_APP_API + '/getListUsers',
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//Get User By ID
export const getUserByID = async (token, id) =>
    await axios.get(import.meta.env.VITE_APP_API + '/getUserByID/' + id,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//Update users
export const updateUser = async (token, id, values) =>
    await axios.put(import.meta.env.VITE_APP_API + '/updateUser/' + id, values,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//Reset Password
export const resetPassword = async (token, id, values) =>
    await axios.put(import.meta.env.VITE_APP_API + '/resetPassword/' + id, values,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//Login
export const login = async (values) =>
    await axios.post(import.meta.env.VITE_APP_API + '/login', values)


export const loginByProviderId = async(values) =>
    await axios.post(import.meta.env.VITE_APP_API + '/loginByProviderId', values)


//Current User
export const currentResponder = async (token) =>
    await axios.post(import.meta.env.VITE_APP_API + '/currentResponder',
        {},
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//Current Approver
export const currentApprover = async (token) =>
    await axios.post(import.meta.env.VITE_APP_API + '/currentApprover',
        {},
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


export const getTokenHealthID = async (values) => {
    return await axios.post(`https://moph.id.th/api/v1/token`, {
        grant_type: values.grant_type,
        code: values.code,
        redirect_uri: values.redirect_uri,
        client_id: values.client_id,
        client_secret: values.client_secret
    },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    )
}

export const getTokenProviderID = async (values) => {
    return await axios.post(`https://provider.id.th/api/v1/services/token`, values)
}


export const getProviderProfile = async(access_token, client_id, secret_key) =>
    await axios.get(`https://provider.id.th/api/v1/services/profile`,
        {
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + access_token,
                "client-id": client_id,
                "secret-key": secret_key
            }
        }
    )