import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import {connect} from "react-redux";
import store from "../../store/index";


class PositionedSnackbar extends React.Component {
    timer = null;

    componentDidMount() {
        console.log(this.props)
    }

    handleClick = state => () => {
        this.setState({open: true, ...state});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const {vertical, horizontal, open, msg} = this.props.snackbar;
        if(open && !this.timer){
            this.timer = setTimeout(() => {
                store.dispatch({
                    type: 'SNACKBAR_CHANGE',
                    snackbar: {
                        open: false
                    }
                });
                this.timer = null;
            }, 2000);
        }
        return (
            <div>
                <Snackbar
                    anchorOrigin={{vertical, horizontal}}
                    open={open}
                    onClose={this.handleClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{msg}</span>}
                />
            </div>
        );


    }
}


const mapStateToProps = (store) => {
    return {
        snackbar: store.snackbar
    }
}

export default connect(mapStateToProps)(PositionedSnackbar)


