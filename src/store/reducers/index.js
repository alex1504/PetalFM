import {combineReducers} from "redux";
import users from "./users";
import snackbar from "./snackbar";
import drawer from "./drawer";
import songs from "./songs";


export default combineReducers({
    users,
    songs,
    snackbar,
    drawer
})
