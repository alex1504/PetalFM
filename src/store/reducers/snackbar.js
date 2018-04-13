import {SNACKBAR_CHANGE} from "../types/index";

const initState = {
    open: false,
    vertical: 'top',
    horizontal: 'center',
    msg: 'message'
}

export default function (state = initState, action){
    switch(action.type){
        case SNACKBAR_CHANGE:
            return {
                ...Object.assign(initState, action.snackbar)
            };
        default:
            return state
    }
}