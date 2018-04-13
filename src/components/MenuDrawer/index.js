import React from 'react';
import commonStyles from "../../index.less";
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import styles from "./index.less";
import List, {ListItem, ListItemText} from 'material-ui/List';
import {connect} from "react-redux";
import CSSModules from "react-css-modules/dist/index";
import {DRAWER_CHANGE, SNACKBAR_CHANGE, SONG_CHANGE, USER_CHANGE} from "../../store/types";
import store from "../../store/index"
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Services from "../../services/index";
import {withRouter} from "react-router-dom";
import {Link} from "react-router-dom";

const drawerStyle = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

class MenuDrawer extends React.Component {
    state = {
        left: this.props.drawer.left,
        open: true
    };

    toggleDrawer = (side, open) => () => {
        store.dispatch({
            type: DRAWER_CHANGE,
            drawer: {
                left: open
            }
        })
    };

    toggleChannelItem = (e) => {
        e.stopPropagation();
        this.setState({open: !this.state.open});
    };

    logout() {
        Services.userServices.logout()
            .then(res => {
                store.dispatch({
                    type: USER_CHANGE,
                    users: {
                        userId: ''
                    }
                });
                this.props.history.push("/login");
                store.dispatch({
                    type: SNACKBAR_CHANGE,
                    users: {
                        open: true,
                        msg: "登出成功"
                    }
                })
            })
    }

    showSnackbar(info) {
        store.dispatch({
            type: SNACKBAR_CHANGE,
            snackbar: {
                open: true,
                msg: `当前${info.channelName}共${info.activeChannelTotal}首歌`
            }
        })
    }

    changeChannel(index) {
        let {qualitySongList, customiseSongList, collectSongList} = this.props.songs;
        const mapper = {
            0: {
                path: '/index/quality',
                channelName: "精选FMHz",
                activeChannelTotal: qualitySongList.length,
                action: function () {
                    store.dispatch({
                        type: SONG_CHANGE,
                        songs: {
                            songList: qualitySongList,
                            activeIndex: 0
                        }
                    })
                }
            },
            1: {
                path: '/index/customise',
                channelName: "私人FMHz",
                activeChannelTotal: customiseSongList.length,
                action: function () {
                    store.dispatch({
                        type: SONG_CHANGE,
                        songs: {
                            songList: customiseSongList,
                            activeIndex: 0
                        }
                    })
                }
            },
            2: {
                path: '/index/collect',
                channelName: "红心FMHz",
                activeChannelTotal: collectSongList.length,
                action: function () {
                    store.dispatch({
                        type: SONG_CHANGE,
                        songs: {
                            songList: collectSongList,
                            activeIndex: 0
                        }
                    })
                }
            }
        };
        this.props.history.push(mapper[index].path);
        mapper[index].action();
        this.showSnackbar(mapper[index])
    }

    openSettings() {
        store.dispatch({
            type: SNACKBAR_CHANGE,
            snackbar: {
                open: true,
                msg: "功能开发中"
            }
        })
    }

    render() {
        const {left} = this.props.drawer;
        const isSuperUser = Services.userServices.checkIsSuperUser();
        const sideList = (
            <div>
                <List component="nav">
                    <ListItem button onClick={this.toggleChannelItem}>
                        <i className="iconfont icon-radio" styleName="icon"></i>
                        <ListItemText inset primary="频道"/>
                        {this.state.open ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button onClick={this.changeChannel.bind(this, 0)}>
                                <ListItemText inset primary="精选Hz"/>
                            </ListItem>
                            <ListItem button onClick={this.changeChannel.bind(this, 1)}>
                                <ListItemText inset primary="定制Hz"/>
                            </ListItem>
                            <ListItem button onClick={this.changeChannel.bind(this, 2)}>
                                <ListItemText inset primary="红心Hz"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <Link to="/dislike">
                        <ListItem button>
                            <i className="iconfont icon-virus" styleName="icon"></i>
                            <ListItemText primary="隔离区"/>
                        </ListItem>
                    </Link>
                    <Link to="/guide">
                        <ListItem button>
                            <i className="iconfont icon-customise" styleName="icon"></i>
                            <ListItemText primary="定制标签"/>
                        </ListItem>
                    </Link>
                    <Link to="/search">
                        <ListItem button>
                            <i className="iconfont icon-search" styleName="icon"></i>
                            <ListItemText primary="搜索"/>
                        </ListItem>
                    </Link>
                    {isSuperUser ? <Link to="/admin">
                        <ListItem button>
                            <i className="iconfont icon-admin" styleName="icon"></i>
                            <ListItemText primary="后台"/>
                        </ListItem>
                    </Link> : <div></div>}
                    <ListItem button onClick={this.openSettings.bind(this)}>
                        <i className="iconfont icon-setting" styleName="icon"></i>
                        <ListItemText primary="设置"/>
                    </ListItem>
                    <ListItem button onClick={this.logout.bind(this)}>
                        <i className="iconfont icon-logout" styleName="icon"></i>
                        <ListItemText primary="登出"/>
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div>
                <Drawer open={left} onClose={this.toggleDrawer('left', false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    >
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
}


const mapStateToProps = (store) => {
    return {
        drawer: store.drawer,
        songs: store.songs
    }
};

MenuDrawer = CSSModules(MenuDrawer, {
    ...commonStyles,
    ...styles
}, {
    allowMultiple: true
});

MenuDrawer = withStyles(drawerStyle)(MenuDrawer)
MenuDrawer = withRouter(MenuDrawer)

export default connect(mapStateToProps)(MenuDrawer)