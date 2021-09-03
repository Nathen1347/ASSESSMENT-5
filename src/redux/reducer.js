const initialState = {
        username: user.username,
        img: user.img
}

const USER_INFO = 'USER_INFO'
const LOGOUT = 'LOGOUT'

export const updateUser = (initialState) => {
    return {
        type: USER_INFO,
        payload: initialState
    }
}

export const logout = () => {
    return{
        type: LOGOUT,
    }
}

export default function reducer(state=initialState, action){
    switch(action.type){
        case USER_INFO :
            return{...state}
        case LOGOUT :
    default:  return state;
    }
}