import React, {Component} from "react";
import styles from "./index.less";
import commonStyles from "../../index.less";
import Services from "../../services/index";
import List, {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import CSSModules from "react-css-modules/dist/index";
import store from "../../store";
import {SNACKBAR_CHANGE} from "../../store/types";
import {connect} from "react-redux";


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTxt: "",
            list: [],
            checkList: [],
            catgList: [],
            searchTypeList: [
                "netease",
                "qq",
                "kugou",
                "kuwo",
                "xiami",
                "qingting",
                "netease",
                "ximalaya"
            ],
            searchType: 1
        };
    }

    componentDidMount() {
        Services.songServices.fetchSongCatg().then(res => {
            this.setState({
                catgList: res
            });
            console.log(res);
        });
    }

    searchSong() {
        if (!this.state.searchTxt.trim()) {
            console.log("搜索内容为空");
            return;
        }
        const {userId} = this.props.users;
        const searchTxt = this.state.searchTxt
        const searchType = this.state.searchType;
        Services.songServices
            .search(userId, searchTxt, searchType)
            .then(res => {
                if(res.length){
                    this.setState({
                        list: res,
                        checkList: res.map((song) => {
                            let arr = this.state.catgList.map(catg=> false);
                            return arr;
                        })
                    });
                }else{

                }
            });
    }

    onSearchInput(e) {
        this.setState({
            searchTxt: e.target.value
        });
    }

    onChange(songIndex, catgIndex, e, isSelect) {
        const catId = this.state.catgList[catgIndex].id;
        let checkList = this.state.checkList.map((arr, index) => {
            if (index === songIndex) {
                arr[catgIndex] = !arr[catgIndex];
                return arr;
            } else {
                return arr;
            }
        });
        this.setState({
            checkList: checkList
        });
    }

    collectSong(songIndex,e) {
        e.stopPropagation();
        e.preventDefault();
        const {userId} = this.props.users;
        let list = this.state.list;
        let songInfo = list[songIndex];
        songInfo.public = 2;
        songInfo.quality = 2;
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
                Services.songServices.collectSong(userId, id).then(res => {
                    console.log(res);
                    list[songIndex].isCollect = !list[songIndex].isCollect;
                    this.setState({
                        list: list
                    });
                    if (res.isCollect) {
                        store.dispatch({
                            type: SNACKBAR_CHANGE,
                            snackbar: {
                                open: true,
                                msg: `收藏成功`
                            }
                        });
                    } else {
                        store.dispatch({
                            type: SNACKBAR_CHANGE,
                            snackbar: {
                                open: true,
                                msg: `取消收藏成功`
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
                        msg: `收藏失败`
                    }
                });
            });
    }

    onSearchTypeChange(selectValue) {
        this.setState({
            searchType: selectValue
        });
    }

    render() {
        return (
            <section>
                <div styleName="search-box">
                    <div styleName="input-wrap">
                        <TextField
                            fullWidth
                            id="name"
                            label="song or author"
                            value={this.state.name}
                            onInput={this.onSearchInput.bind(this)}
                            margin="normal"
                        />
                    </div>
                    <div>
                        <Button variant="raised" color="primary" onClick={this.searchSong.bind(this)}>
                            搜索
                        </Button>
                    </div>
                </div>

                <div className="card-wrap">
                    <List>
                        {this.state.list.map((item, index) => (
                            <section styleName="list-box" key={index}>
                                <ListItem dense button>
                                    <Avatar style={{marginRight: '10px'}} alt="Remy Sharp" src={item.album.picUrl} />
                                    <div>
                                        <div>
                                            <ListItemText primary={item.name}/>
                                        </div>
                                        <div>
                                            <ListItemText primary={item.album.artists[0].name}/>
                                        </div>
                                    </div>
                                    <ListItemSecondaryAction>
                                        <a onClick={this.collectSong.bind(this,index)}>
                                            <i className="iconfont icon-love" styleName={item.isCollect ? "icon icon-love-active" : "icon icon-love"}></i>
                                        </a>
                                        <a download href={`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`}>
                                            <i className="iconfont icon-download" styleName="icon icon-download"></i>
                                        </a>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </section>
                        ))}
                    </List>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        snackbar: store.snackbar,
        users: store.users
    }
};

Search = CSSModules(Search, {
    ...commonStyles,
    ...styles
}, {
    allowMultiple: true
});

export default connect(mapStateToProps)(Search)

