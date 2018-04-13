import {SONG_CHANGE} from "../types/index";

const initState = {
    // 当前播放列表
    songList: [],
    // 当前播放歌曲索引
    activeIndex: 0,
    // 精选列表
    qualitySongList: [],
    // 私人定制列表
    customiseSongList: [],
    // 收藏列表
    collectSongList: [],
    isPlay: false
}

export default function(state = initState, action){
    switch(action.type){
        case SONG_CHANGE:
            return {
                ...Object.assign(initState, action.songs)
            };
        default:
            return state
    }
}