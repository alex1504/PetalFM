import React, {Component} from "react";
import styles from "./index.less";
import Button from 'material-ui/Button';
import {withRouter} from "react-router-dom";
import Services from "../../services/index";
import List, {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import store from "../../store/index"
import {SNACKBAR_CHANGE} from "../../store/types/index";
import CSSModules from "react-css-modules/dist/index";
import {connect} from "react-redux";


class Guide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            catgList: [],
        };
    }

    async fetchSongCatgByUserId(userId) {
        let tempObj = {}
        let arr = await Services.songServices.fetchSongCatgByUserId(userId);
        arr.forEach(obj => {
            tempObj[obj.catgId] = 1
        });
        Services.songServices.fetchSongCatg().then(res => {
            this.setState({
                catgList: res.map(obj => {
                    return {
                        ...obj,
                        isSelect: tempObj[obj.id] ? true : false
                    };
                })
            });
        });
    }

    componentDidMount() {
        const {userId} = this.props.users;
        this.fetchSongCatgByUserId(userId)
    }

    onTagSelectChange(value) {
        let arr = this.state.catgList;
        arr = arr.map((obj, index) => {
            if (index == value) {
                obj.isSelect = !obj.isSelect;
            }
            return obj;
        });
        this.setState({
            selectCatgList: arr
        });
        console.log(arr);
    }

    customiseFM() {
        const currentUser = Services.userServices.getCurrentUser();
        const userId = currentUser && currentUser.id;
        const catgArr = this.state.catgList.filter(catg => {
            return catg.isSelect;
        });
        if (!userId) {
            // 用户登陆超时了..Todo
            return;
        }
        Services.songServices.addUserCatgRelations(catgArr, userId).then(res => {
            if (res.length) {
                store.dispatch({
                    type: SNACKBAR_CHANGE,
                    snackbar: {
                        open: true,
                        msg: "定制私人FM成功"
                    }
                });
                this.props.history.push("/index/customise");
            } else {
                store.dispatch({
                    type: SNACKBAR_CHANGE,
                    snackbar: {
                        open: true,
                        msg: "请至少选择一个标签"
                    }
                })
            }
        });
    }

    enterFM() {
        const currentUser = Services.userServices.getCurrentUser();
        const userId = currentUser && currentUser.id;
        this.props.history.push("/index/quality");
        // 删除用户定制的歌曲标签
        /*Services.songServices.deleteUserCatgRelations(userId)
            .then(res=>{
                this.props.history.push("/index/quality");
            })*/
    }

    render() {
        return (
            <div styleName="container">
                <h3 styleName="title">客观您的喜好是什么呢？</h3>
                <div styleName="list">
                    <List>
                        {this.state.catgList.map((item, index) => (
                            <ListItem
                                style={{color: 'red'}}
                                key={index}
                                role={undefined}
                                dense
                                button
                                onClick={this.onTagSelectChange.bind(this, index)}
                            >
                                <Checkbox
                                    checked={item.isSelect}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={item.name}/>
                                <ListItemSecondaryAction>
                                    <i className="iconfont icon-tag" styleName="icon"></i>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className="f-tc f-mgt30">
                    <Button style={{marginRight: '10px'}} variant="raised" color="primary"
                            onClick={this.customiseFM.bind(this)}>
                        进入FM
                    </Button>
                    <Button variant="raised" color="secondary" onClick={this.enterFM.bind(this)}>
                        随便听听
                    </Button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (store) => {
    return {
        snackbar: store.snackbar,
        songs: store.songs,
        users: store.users
    }
};

Guide = CSSModules(Guide, {
    ...styles
}, {
    allowMultiple: true
});

Guide = withRouter(Guide);

export default connect(mapStateToProps)(Guide)

