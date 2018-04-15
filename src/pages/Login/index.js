import React, {Component} from "react";
import {connect} from "react-redux"
import {withRouter} from "react-router-dom"
import styles from "./index.less";
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import store from "../../store/index"
import {SNACKBAR_CHANGE} from "../../store/types/index"

import Services from "../../services/index";
import CSSModules from "react-css-modules/dist/index";
import {USER_CHANGE} from "../../store/types";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            open: false,
            vertical: null,
            horizontal: null
        };
    }

    handleClick = state => () => {
        this.setState({open: true, ...state});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    componentDidMount() {
        store.dispatch({
            type: SNACKBAR_CHANGE,
            snackbar: {
                open: true,
                msg: "Username:petalFM Password:petalFM",
                seconds: 5000
            }
        })
        console.log(this.props)
    }

    showCatchError(err) {
        err = err.toString();
        let msg = err.match(/:([\s\S]+?)[\.|。]/);
        let code = err.match(/\[(\d+)/);
        msg = msg[1].trim();
        code = code[1];
        console.log(`${code} | ${msg}`);
        store.dispatch({
            type: SNACKBAR_CHANGE,
            snackbar: {
                open: true,
                msg: msg
            }
        })
    }

    validateInput() {
        /*const mailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return !mailReg.test(this.state.username)
          ? {
              flag: false,
              msg: "Not a valid email format"
            }
          : !this.state.password
            ? {
                flag: false,
                msg: "Password is required"
              }
            : {
                flag: true,
                msg: ""
              };*/
        const username = this.state.username.trim();
        const password = this.state.password.trim();
        if(!username.trim()){
            return {
                flag: false,
                msg: "Username is required"
            }
        }
        if(!password.trim()){
            return {
                flag: false,
                msg: "Password is required"
            }
        }
        if(!/^[a-zA-Z0-9_]{4,8}$/.test(username)){
            return {
                flag: false,
                msg: "Username should be 4 to 8 character, number or _",
                seconds: 4000
            }
        }
        if(!/^[a-zA-Z0-9_]{4,8}$/.test(password)){
            return {
                flag: false,
                msg: "Password should be 4 to 8 character, number or _ ",
                seconds: 4000
            }
        }
        return {flag: true}
    }

    login() {
        const checkResult = this.validateInput();
        if (!checkResult.flag) {
            store.dispatch({
                type: SNACKBAR_CHANGE,
                snackbar: {
                    open: true,
                    msg: checkResult.msg
                }
            })
            return;
        }
        Services.userServices
            .login({username: this.state.username, password: this.state.password})
            .then(res => {
                console.log(res);
                if (res.id) {
                    store.dispatch({
                        type: SNACKBAR_CHANGE,
                        snackbar: {
                            open: true,
                            msg: "登陆成功"
                        }
                    })
                    store.dispatch({
                        type: USER_CHANGE,
                        users: {
                            userId: res.id
                        }
                    })
                    this.props.history.push("/guide");
                } else {
                    store.dispatch({
                        type: SNACKBAR_CHANGE,
                        snackbar: {
                            open: true,
                            msg: "登录失败"
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.showCatchError(err);
            });
    }

    regist() {
        const checkResult = this.validateInput();
        if (!checkResult.flag) {
            store.dispatch({
                type: SNACKBAR_CHANGE,
                snackbar: {
                    open: true,
                    msg: checkResult.msg
                }
            })
            return;
        }
        Services.userServices
            .regist({
                username: this.state.username,
                password: this.state.password,
                email: this.state.username
            })
            .then(res => {
                console.log(res);
                if (res.id) {
                    store.dispatch({
                        type: SNACKBAR_CHANGE,
                        snackbar: {
                            open: true,
                            msg: "注册成功"
                        }
                    })
                    store.dispatch({
                        type: USER_CHANGE,
                        users: {
                            userId: res.id
                        }
                    })
                    this.props.history.push("/guide");
                } else {
                    store.dispatch({
                        type: SNACKBAR_CHANGE,
                        snackbar: {
                            open: true,
                            msg: "注册失败"
                        }
                    })
                }
                console.log(res);
            })
            .catch(err => {
                this.showCatchError(err);
            });
    }

    onUsernameChange(e) {
        this.setState({
            username: e.target.value
        });
    }

    onPasswordChange(e) {
        this.setState({
            password: e.target.value
        });
    }

    render() {
        return (
            <div styleName="container">
                <div styleName="bg-img" style={{backgroundImage: 'url(' + require('./imgs/bg.jpg') + ')'}}></div>
                <div styleName="cover"></div>
                <div styleName="content">
                    <div styleName="logo-box">
                        花瓣FM
                    </div>
                    <div styleName="form">
                        <div>
                            <Grid container spacing={8} alignItems="flex-end">
                                <Grid item xs={2}>
                                    <i className="iconfont icon-user" styleName="icon"></i>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField color="#fff" fullWidth id="input-with-icon-grid" label="用户名" required
                                               onChange={this.onUsernameChange.bind(this)}/>
                                </Grid>
                            </Grid>
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <Grid container spacing={8} alignItems="flex-end">
                                <Grid item xs={2}>
                                    <i className="iconfont icon-password" styleName="icon"></i>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField color="#fff" fullWidth type="password" id="input-with-icon-grid" required
                                               label="密码"
                                               onChange={this.onPasswordChange.bind(this)}/>
                                </Grid>
                            </Grid>
                        </div>
                        <div styleName="btn-box">
                        <span styleName="btn">
                            <Button variant="raised" color="primary" onClick={this.login.bind(this)}>
                                登录
                            </Button>
                        </span>
                            <span styleName="btn">
                            <Button variant="raised" color="secondary" onClick={this.regist.bind(this)}>
                                注册
                            </Button>
                        </span>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        snackbar: store.snackbar,
        users: store.users
    }
};


Login = CSSModules(Login, {
    ...styles
}, {
    allowMultiple: true
});

Login = withRouter(Login)

export default connect(mapStateToProps)(Login)


