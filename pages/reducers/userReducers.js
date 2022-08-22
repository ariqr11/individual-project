const INITIAL_STATE = {
    idusers: null,
    username: '',
    email: '',
    status: '',
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            delete action.payload.password; // menghapus property password dari payload
            console.log("Data Action", action)
            return { ...state, ...action.payload };
        case "UPDATE_STATUS":
            return { ...state, status: action.payload };
        case "LOGOUT_SUCCESS":
            return INITIAL_STATE;
        default:
            return state
    }
}