import React from "react";
import {connect} from "react-redux";
import store from "../../store/index";
import {SONG_CHANGE} from "../../store/types";

class Audio extends React.Component {
    componentDidMount() {
        console.log(this.props)
    }

    onAudioEnded() {
        let {activeIndex, songList} = this.props.songs;
        activeIndex = activeIndex === songList.length - 1 ? 0 : activeIndex + 1;
        store.dispatch({
            type: SONG_CHANGE,
            songs: {
                activeIndex
            }
        })
    }

    render() {
        const {activeIndex, songList, isPlay} = this.props.songs;

        if (isPlay) {
            setTimeout(() => {
                this.refs.audio && this.refs.audio.play()
            }, 0)
        } else {
            setTimeout(() => {
                this.refs.audio && this.refs.audio.pause()
            }, 0)
        }
        return (
            <div>
                <audio ref="audio" src={songList && songList[activeIndex] && songList[activeIndex].music}
                       onEnded={this.onAudioEnded.bind(this)}></audio>
            </div>
        )

    }
}


const mapStateToProps = (store) => {
    return {
        snackbar: store.snackbar,
        songs: store.songs
    }
};

Audio = connect(mapStateToProps)(Audio);

export default Audio;