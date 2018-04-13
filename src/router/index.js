import React from "react";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Guide from "../pages/Guide";
import Index from "../pages/Index";
import Search from "../pages/Search";
import Dislike from "../pages/Dislike";
import {HashRouter, Route, Switch, Redirect} from "react-router-dom"
import Snackbar from "../components/Snackbar/index"
import Audio from "../components/Audio/index"
import Services from "../services/index"
import MenuDrawer from "../components/MenuDrawer/index"


let PrimaryLayout = () => {
    const isLogin = Services.userServices.checkIsLogin();
    const currentUser = Services.userServices.getCurrentUser();
    const isSuperUser = Services.userServices.checkIsSuperUser();
    console.log('isSuper', isSuperUser);
    console.log('isLogin', isLogin);
    return (
        <div className="container">
            <MenuDrawer/>
            <Snackbar/>
            <Audio/>
            <Switch>
                <Route
                    path="/"
                    exact
                    render={props => {
                        return isLogin ? <Redirect to="/index/quality"/> : <Login/>;
                    }}
                />
                <Route path="/search" render={props => {
                    return isLogin ? <Search/> : <Login/>;
                }}/>
                <Route path="/admin" render={props => {
                    return isSuperUser ? <Admin/> : <Index/>;
                }}/>
                <Route exact path="/index" render={props => {
                    return isLogin ? <Redirect to="/index/quality"/> : <Login/>;
                }}/>
                <Route path="/login" component={Login}/>
                <Route path="/guide" render={props => {
                    return isLogin ? <Guide/> : <Login/>;
                }}/>
                <Route path="/dislike" render={props => {
                    return isLogin ? <Dislike/> : <Login/>;
                }}/>
                <Route path="/index/:fmType" render={props => {
                    return isLogin ? <Index/> : <Login/>;
                }}/>

                <Route render={props => {
                    return isLogin ? <Redirect to="/index/quality"/> : <Login/>;
                }}/>
            </Switch>

        </div>
    )
};


const Root = () => (
    <HashRouter>
        <PrimaryLayout/>
    </HashRouter>
);

export default Root


