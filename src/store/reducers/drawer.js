import {DRAWER_CHANGE} from "../types/index";


const initState = {
    left: false,
    bottom: false
};

export default function(state = initState, action){
    switch(action.type){
        case DRAWER_CHANGE:
            return {
                ...Object.assign(initState, action.drawer)
            };
        default:
            return state
    }
}