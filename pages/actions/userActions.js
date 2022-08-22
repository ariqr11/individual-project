export const loginAction = (data) => {
    console.log("Data dari page login", data)
    return {
        type: "LOGIN_SUCCESS",
        payload: data
    }
}


export const logoutAction = () => {
    return {
        type: "LOGOUT_SUCCESS"
    }
}