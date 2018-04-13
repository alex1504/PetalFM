import {USER_CHANGE} from "../types/index";
import Services from "../../services";


const currentUser = Services.userServices.getCurrentUser();
const userId = currentUser && currentUser.id;
const initState = {
    userId: userId
};

export default function(state = initState, action){
    switch(action.type){
        case USER_CHANGE:
            return {
                ...Object.assign(initState, action.users)
            };
        default:
            return state
    }
}