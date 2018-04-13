import axios from 'axios'
import AV from './avInit'
import Services from "./index";

export default {
    /**
     * 注册
     * @param {Object} userInfo {username:required, password: required, email: optional}
     */
    regist(userInfo) {
        let user = new AV.User();
        user.setUsername(userInfo.username);
        user.setPassword(userInfo.password);
        // user.setEmail(userInfo.email || '');
        return user.signUp()
    },
    /**
     * 登录
     * @param {Object} userInfo {username:required, password: required}
     */
    login(userInfo) {
        return AV
            .User
            .logIn(userInfo.username,userInfo.password)

    },
    logout(){
        return AV.User.logOut()
    },
    /**
     * 获取当前用户信息
     */
    getCurrentUser(){
        return AV.User.current();
    },
    /**
     * 判断是否处于登录状态
     */
    checkIsLogin(){
        const currentUser = AV.User.current();
        return currentUser ? true : false
    },
    /**
     * 判断是否是超级管理员
     * @returns {boolean}
     */
    checkIsSuperUser(){
        const currentUser = this.getCurrentUser();
        return currentUser ? (currentUser.id === "5ab459649f54543687b6da7b" ? true : false) : false;
    }
}