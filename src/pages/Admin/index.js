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
import {DRAWER_CHANGE} from "../../store/types";
import {connect} from "react-redux";
import AdminDrawer from "../../components/AdminDrawer/index"

class Admin extends Component {
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
            searchType: 1,
            songIndex: 0
        };
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
            .search(userId, searchTxt, searchType, 60)
            .then(res => {
                console.log(res)
                if (res.length) {
                    this.setState({
                        list: res,
                        checkList: res.map((song) => {
                            let arr = this.state.catgList.map(catg => false);
                            return arr;
                        })
                    });
                } else {
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

    onSearchTypeChange(selectValue) {
        this.setState({
            searchType: selectValue
        });
    }

    showAdminDrawer(songIndex) {
        this.setState({
            songIndex: songIndex
        });
        store.dispatch({
            type: DRAWER_CHANGE,
            drawer: {
                bottom: true
            }
        })
    }

    render() {
        return (
            <section>
                <AdminDrawer songIndex={this.state.songIndex} list={this.state.list}/>
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
                            <section key={index}>
                                <ListItem dense button onClick={this.showAdminDrawer.bind(this, index)}>
                                    <Avatar style={{marginRight: '10px'}} alt="Remy Sharp" src={item.album.picUrl}/>
                                    <div>
                                        <div>
                                            <ListItemText primary={item.name}/>
                                        </div>
                                        <div>
                                            <ListItemText primary={item.album.artists[0].name}/>
                                        </div>
                                    </div>
                                    <ListItemSecondaryAction>
                                        <a href={`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`}>
                                            <i className="iconfont icon-download" styleName="icon-download"></i>
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
        users: store.users
    }
};

Admin = CSSModules(Admin, {
    ...commonStyles,
    ...styles
}, {
    allowMultiple: true
});

export default connect(mapStateToProps)(Admin)


