import axios from "axios";


//Get List Hospital
export const getListHospitals = async (token) =>
    await axios.get(import.meta.env.VITE_APP_API + '/getHospitals',
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )


//Get List Request
export const getListProviderIDRequest = async (token) =>
    await axios.get(import.meta.env.VITE_APP_API + '/getListProviderIDRequest',
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )

//Get request by id
export const createProviderIDRequest = async (token, values) =>
    await axios.post(import.meta.env.VITE_APP_API + '/createProviderIDRequest', values,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )

//Get request by id
export const getProviderIDRequestByID = async (token, values) =>
    await axios.get(import.meta.env.VITE_APP_API + '/getProviderIDRequestByID/' + values,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )

//Update Request 
export const updateProviderRequest = async (token, id, values) =>
    await axios.put(import.meta.env.VITE_APP_API + '/updateProviderRequest/' + id, values,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )

//Update Token 
export const updateClientIDSecretKey = async (token, id, values) =>
    await axios.put(import.meta.env.VITE_APP_API + '/updateClientAndSecretKey/' + id, values,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )