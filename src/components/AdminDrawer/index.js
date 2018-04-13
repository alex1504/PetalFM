import React from 'react';
import {withStyles} from 'material-ui/styles';
import SwipeableDrawer from 'material-ui/SwipeableDrawer';
import {withRouter} from "react-router-dom";
import {DRAWER_CHANGE, SNACKBAR_CHANGE} from "../../store/types";
import CSSModules from 'react-css-modules';
import Checkbox from 'material-ui/Checkbox';
import commonStyles from "../../index.less";
import styles from "./index.less";
import Services from "../../services/index";
import {connect} from "react-redux"
import store from "../../store/index"
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import {FormControl} from 'material-ui/Form';
import Button from 'material-ui/Button';

const drawerStyle = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

class AdminDrawer extends React.Component {
    state = {
        bottom: this.props.drawer.bottom,
        catgList: [],
        checkList: [],
        quality: 1
    };

    toggleDrawer = (side, open) => () => {
        store.dispatch({
            type: DRAWER_CHANGE,
            drawer: {
                bottom: open
            }
        })
    };

    componentDidMount() {
        Services.songServices.fetchSongCatg().then(res => {
            this.setState({
                catgList: res,
                checkList: res.map(obj => false)
            });
            console.log(res);
        });
    }

    onChange(index) {
        this.state.checkList[index] = !this.state.checkList[index];
        this.setState({
            checkList: this.state.checkList
        })
    }

    onClickDrawerContent(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleSelectChange = name => event => {
        console.log(event.target.value)
        this.setState({[name]: event.target.value});
    };

    addSong() {
        const {songIndex, list} = this.props;
        let songInfo = list[songIndex];
        let {catgList, quality} = this.state;
        songInfo.quality = Number(quality);
        let catgArr = [];
        this.state.checkList.forEach((isSelect, index) => {
            if (isSelect) {
                catgArr.push(catgList[index].id)
            }
        });
        Services.songServices
            .addSong({
                ...songInfo
            })
            .then(res => {
                console.log(res);
                const id = res.id;
                if (id) {
                    store.dispatch({
                        type: SNACKBAR_CHANGE,
                        snackbar: {
                            open: true,
                            msg: `添加歌曲成功`
                        }
                    });
                } else {
                    store.dispatch({
                        type: SNACKBAR_CHANGE,
                        snackbar: {
                            open: true,
                            msg: `添加歌曲失败，请重试`
                        }
                    });
                }
                return id;
            })
            .then(id => {
                Services.songServices.addCatgRelations(catgArr, id).then(res => {
                    console.log(res);
                    if (res.length) {
                        store.dispatch({
                            type: SNACKBAR_CHANGE,
                            snackbar: {
                                open: true,
                                msg: `添加歌曲、类别关联成功`
                            }
                        });
                    } else {
                        store.dispatch({
                            type: SNACKBAR_CHANGE,
                            snackbar: {
                                open: true,
                                msg: `添加歌曲、类别关联失败`
                            }
                        });
                    }
                });
            })
            .catch(err => {
                console.log(err);
                store.dispatch({
                    type: SNACKBAR_CHANGE,
                    snackbar: {
                        open: true,
                        msg: `录入失败，请重试`
                    }
                });
            });
    }

    render() {
        const {bottom} = this.props.drawer;
        const sideList = (
            <div>
                <FormControl>
                    <section onClick={this.onClickDrawerContent.bind(this)}>
                        <Select
                            native
                            value={this.state.quality}
                            onChange={this.handleSelectChange('quality')}
                            input={<Input fullWidth id="age-native-helper"/>}
                        >
                            <option value={1}>精选</option>
                            <option value={2}>非精选</option>
                        </Select>
                    </section>
                </FormControl>
                <section styleName="check-box" onClick={this.onClickDrawerContent.bind(this)}>
                    {this.state.catgList.map((item, index) => {
                        return (
                            <div styleName="item" key={"key" + index}>
                                <div styleName="item">
                                    <Checkbox checked={!!this.state.checkList[index]}
                                              onChange={this.onChange.bind(this, index)}></Checkbox>
                                    {item.name}
                                </div>
                            </div>
                        );
                    })}
                </section>
                <section>
                    <Button variant="raised" color="primary" onClick={this.addSong.bind(this)}>
                        录入
                    </Button>
                </section>
            </div>
        );

        return (
            <div>
                <SwipeableDrawer
                    anchor="bottom"
                    open={bottom}
                    onClose={this.toggleDrawer('bottom', false)}
                    onOpen={this.toggleDrawer('bottom', true)}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('bottom', false)}
                        onKeyDown={this.toggleDrawer('bottom', false)}
                    >
                        {sideList}
                    </div>
                </SwipeableDrawer>
            </div>
        );
    }
}


const mapStateToProps = (store) => {
    return {
        drawer: store.drawer
    }
};

AdminDrawer = CSSModules(AdminDrawer, {
    ...commonStyles,
    ...styles
}, {
    allowMultiple: true
});

AdminDrawer = withStyles(drawerStyle)(AdminDrawer)
AdminDrawer = withRouter(AdminDrawer)

export default connect(mapStateToProps)(AdminDrawer)

