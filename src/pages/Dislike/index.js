import React from 'react';
import {withStyles} from 'material-ui/styles';
import List, {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import styles from "./index.less";
import commonStyles from "../../index.less";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import CSSModules from "react-css-modules/dist/index";
import Services from "../../services/index"
import Button from 'material-ui/Button';
import {SNACKBAR_CHANGE} from "../../store/types";
import store from "../../store/index"

class Dislike extends React.Component {
    state = {
        checked: [],
        dislikeList: []
    };

    handleToggle = value => () => {
        const {checked} = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    fetchDislikeSongs() {
        const {userId} = this.props.users;
        Services.songServices.fetchDislikeSongs(userId)
            .then(res => {
                this.setState({
                    dislikeList: res
                })
            })
    }

    componentDidMount() {
        this.fetchDislikeSongs()
    }

    handleCheckboxToggle = value => () => {
        const {checked} = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    reshowDislikeSongs() {
        const {userId} = this.props.users;
        const {dislikeList, checked} = this.state;
        let dislikeIdArr = checked.map(songIndex => {
            return dislikeList[songIndex].id;
        });
        Services.songServices.undoDislikeSong(userId, dislikeIdArr)
            .then(async res => {
                await this.fetchDislikeSongs();
                store.dispatch({
                    type: SNACKBAR_CHANGE,
                    snackbar: {
                        open: true,
                        msg: `真棒！已成功将它们移出隔离区`
                    }
                })
            })
    }

    render() {
        return (
            <div styleName="container">
                {this.state.dislikeList.length ?
                    <section>
                        <h4 styleName="title">拯救曾经被你隔离的“它们”</h4>
                        {this.state.dislikeList.map((item, index) => (
                            <section styleName="list-box" key={index}>
                                <ListItem dense button>
                                    <Avatar style={{marginRight: '10px'}} alt="avatar" src={item.pic}/>
                                    <div>
                                        <div>
                                            <ListItemText primary={item.name}/>
                                        </div>
                                        <div>
                                            <ListItemText primary={item.name}/>
                                        </div>
                                    </div>
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            onChange={this.handleCheckboxToggle(index)}
                                            checked={this.state.checked.indexOf(index) !== -1}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </section>
                        ))}
                        <section styleName="btn-box">
                            <Button variant="raised" color="primary" onClick={this.reshowDislikeSongs.bind(this)}>
                                治愈
                            </Button>
                        </section>
                    </section>
                    :
                    <h4 styleName="title">隔离区空空如也..❀</h4>
                }
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        users: store.users
    }
};

Dislike = CSSModules(Dislike, {
    ...commonStyles,
    ...styles
}, {
    allowMultiple: true
});

Dislike = withRouter(Dislike)

export default connect(mapStateToProps)(Dislike)


