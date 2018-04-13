import axios from "axios";
import AV from "./avInit";
import {MUSIC_PROVIDER_HOST} from "./config";
import {shuffle} from "../utils/index"
import {mapNumberToFilter, mapNumberToType} from "./config"

export default {
    /**
     * 搜索Music
     * @param {String} query  字符串或id
     * @param {Number} type   搜索类型 eg: '1.歌曲','10.专辑','100.歌手', '1000.歌单', '1002.用户', 'mv.1004', '1006.歌词', '1009.电台'
     */
    async search(userId, query, type, limit) {
        let songidMap = {};
        let userCollectSongs = await this.fetchCollectSongs(userId).then(res => {
            res.forEach(song => {
                songidMap[song.songid] = 1;
            });
        });
        let params = new URLSearchParams();
        params.append("s", query);
        params.append("type", type);
        params.append("limit", limit || 40);
        return axios({
            method: "post",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            url: `${MUSIC_PROVIDER_HOST}/search/pc`,
            data: params
        }).then(res => {
            const code = res.data.code;
            let songs = [];
            if (code === 200) {
                songs = res.data.result.songs;
                songs = songs.map(obj => {
                    return {
                        ...obj,
                        isCollect: !!songidMap[obj.id]
                    }
                });
                return songs;
            }else{
                return []
            }
        });
    },
    /**
     * 获取歌曲类别列表
     * @returns {*|Promise<T>}
     */
    fetchSongCatg() {
        let query = new AV.Query("Category");
        return query.find().then(res => {
            return res.map(obj => {
                return {
                    ...obj.attributes,
                    id: obj.id
                };
            });
        });
    },
    /**
     * 获取用户喜爱标签
     * @param userId
     */
    fetchSongCatgByUserId(userId) {
        let query = new AV.Query("Rel_user_category");
        query.equalTo("userId", userId)
        return query.find().then(res => {
            return res.map(obj => {
                return {
                    ...obj.attributes,
                    id: obj.id
                };
            });
        });
    },
    /**
     * 根据音乐songid查询歌曲
     * @param songid(并非歌曲objectId)
     * @returns {*|Promise}
     */
    findSongBySongid(songid) {
        let query = new AV.Query('Song');
        query.equalTo("songid", songid);
        return query.find();
    },
    /**
     * 根据音乐songid数组查询歌曲
     * @param songidArr
     * @returns {Promise<any>}
     */
    findSongsBySongidArr(songidArr) {
        let songidQuery = songidArr.map(songid => {
            let tempQuery = new AV.query('Song');
            tempQuery.equalTo('songid', songid);
            return tempQuery;
        });
        let query = AV.Query.or(...songidQuery);
        return query.find();
    },
    /**
     * 添加歌曲
     * @param {Object} songInfo   public（默认1）: 1->公开  2->私有； quality（默认1）： 1->精选 2->非精选
     */
    async addSong(songInfo) {
        console.log(songInfo);
        let Song = AV.Object.extend("Song");
        let existSongs = await this.findSongBySongid(songInfo.id);
        if (!existSongs.length) {
            let song = new Song();
            song.set("name", songInfo.name);
            song.set("author", songInfo.artists.map(artist => artist.name).join(','));
            song.set("pic", songInfo.album.picUrl);
            song.set("music", `https://music.163.com/song/media/outer/url?id=${songInfo.id}.mp3`);
            song.set("link", `http://music.163.com/#/song?id=${songInfo.id}`);
            song.set("type", songInfo.type || 'netease');
            song.set("songid", songInfo.id);
            song.set("public", songInfo.public || 1);
            song.set("quality", songInfo.quality || 1);
            return song.save();
        } else {
            return existSongs[0]
        }

    },
    /**
     * 添加歌曲类别和歌曲关系记录
     * @param catgArr
     * @param songObjectId
     * @returns {*}
     */
    addCatgRelations(catgArr, songObjectId) {
        let promises = catgArr.map(catgId => {
            return new Promise((resolve, reject) => {
                let RelCatgSong = AV.Object.extend("Rel_category_song");
                let relCatgSong = new RelCatgSong();
                relCatgSong.set("catgId", catgId);
                relCatgSong.set("songId", songObjectId);
                relCatgSong
                    .save()
                    .then(res => {
                        if (res.id) {
                            resolve(res);
                        } else {
                            reject();
                        }
                    })
                    .catch(err => {
                        reject();
                    });
            });
        });
        return Promise.all(promises);
    },
    /**
     * 删除用户定制歌曲类别
     * @param userId
     * @returns {*|Promise<T>}
     */
    deleteUserCatgRelations(userId) {
        let rel_user_category = new AV.Query("Rel_user_category");
        rel_user_category.equalTo("userId", userId);
        return rel_user_category.find()
            .then(res => {
                if (res) {
                    AV.Object.destroyAll(res)
                }
            })
    },
    /**
     * 添加用户与歌曲类别关联
     * @param {Array} catgArr: 歌曲类别对象
     * @param {string} userId: 用户id
     */
    async addUserCatgRelations(catgArr, userId) {
        await this.deleteUserCatgRelations(userId);
        let promises = catgArr.map(catg => {
            return new Promise((resolve, reject) => {
                let RelUserCatg = AV.Object.extend("Rel_user_category");
                let relUserCatg = new RelUserCatg();
                relUserCatg.set("userId", userId);
                relUserCatg.set("catgId", catg.id);
                relUserCatg
                    .save()
                    .then(res => {
                        if (res.id) {
                            resolve(res);
                        } else {
                            reject();
                        }
                    })
                    .catch(err => {
                        reject();
                    });
            });
        });
        return Promise.all(promises);
    },

    /**
     * 获取用户喜欢歌曲id对象
     * @param userId
     * @returns {*|Promise<T>} 传递歌曲id对象
     */
    fetchCollectSongsIdObject(userId) {
        let rel_user_collect = new AV.Query("Rel_user_collect");
        rel_user_collect.equalTo("userId", userId);
        let tempObj = {}
        return rel_user_collect.find().then(res => {
            res.forEach(obj => {
                tempObj[obj.attributes.songId] = 1
            });
            return tempObj
        })
    },

    /**
     * 获取用户不喜欢的歌曲id
     * @param userId
     * @returns {*|Promise<T>} 传递歌曲id数组
     */
    fetchDislikeSongsId(userId) {
        let userSongDislikeQuery = new AV.Query("Rel_user_song_dislike");
        userSongDislikeQuery.equalTo('userId', userId);
        return userSongDislikeQuery.find().then(res => {
            return res.map(obj => obj.attributes.songId);
        });
    },
    /**
     * 根据歌曲类别id获取歌曲id
     * @param catgIdArr
     * @returns {Promise<void>}
     */
    async fetchSongsIdByCatgId(catgIdArr) {
        let songIdQueryArr = catgIdArr.map(catgId => {
            let tempQuery = new AV.Query("Rel_category_song");
            tempQuery.equalTo("catgId", catgId);
            return tempQuery;
        });
        let songIdQuery = AV.Query.or(...songIdQueryArr);
        let songIdArr = await songIdQuery.find().then(res => {
            return res.map(obj => obj.attributes.songId);
        });
        return songIdArr;
    },
    /**
     * 获取精选歌曲列表~~
     * @param userId
     * @returns {Promise<*|Promise<T>>}
     */
    async fetchQualitySongs(userId) {
        // 查找用户不希望出现的歌曲id
        let dislikeSongIdArr = await this.fetchDislikeSongsId(userId);
        // 查找用户收藏的歌曲id
        let userCollectSongsIdObj = await this.fetchCollectSongsIdObject(userId);
        let songQuery = new AV.Query("Song");
        songQuery.equalTo("public", 1);
        songQuery.equalTo("quality", 1);
        return songQuery.find().then(res => {
            res = res.map(obj => {
                return {
                    ...obj.attributes,
                    id: obj.id,
                    isCollect: userCollectSongsIdObj[obj.id] ? true : false
                };
            });
            // 过滤用户不希望出现的歌曲
            res = res.filter(obj => {
                return dislikeSongIdArr.indexOf(obj.id) === -1
            });
            return shuffle(res)
        });
    },
    /**
     * 获取用户定制的歌曲列表~~
     * @param {string} userId
     * @returns {Promise<*>}
     */
    async fetchCustomiseSongs(userId) {
        let catgIdQuery = new AV.Query("Rel_user_category");
        catgIdQuery.equalTo("userId", userId);
        let catgIdArr = await catgIdQuery.find().then(res => {
            return res.map(obj => obj.attributes.catgId);
        });
        // 查找用户不希望出现的歌曲id
        let dislikeSongIdArr = await this.fetchDislikeSongsId(userId);
        // 查找用户收藏的歌曲id
        let userCollectSongsIdObj = await this.fetchCollectSongsIdObject(userId);
        if (catgIdArr.length) {
            // 若找到用户定制的歌曲类别,查找歌曲类别下的所有歌曲id
            let songIdArr = await this.fetchSongsIdByCatgId(catgIdArr);

            // 通过歌曲id获取歌曲并返回
            let songQueryArr = songIdArr.map(songId => {
                let tempQuery = new AV.Query("Song");
                tempQuery.equalTo("objectId", songId);
                return tempQuery;
            });
            // 若找不到用户定制歌曲类别，查找所有歌曲并返回
            if (!songQueryArr.length) {
                return []
                /*let songQuery = new AV.Query("Song");
                return songQuery.find().then(res => {
                    res = res.map(obj => {
                        return {
                            ...obj.attributes,
                            id: obj.id,
                            isCollect: userCollectSongsIdObj[obj.id] ? true : false
                        };
                    });
                    // 过滤用户不希望出现的歌曲
                    res = res.filter(obj => {
                        return dislikeSongIdArr.indexOf(obj.id) === -1
                    });
                    return shuffle(res)
                });*/
            }
            // 若找到定制歌曲
            let songQuery = AV.Query.or(...songQueryArr);
            return songQuery.find().then(res => {
                console.log(res)
                res = res.map(obj => {
                    return {
                        ...obj.attributes,
                        id: obj.id,
                        isCollect: userCollectSongsIdObj[obj.id] ? true : false
                    };
                });
                // 过滤用户不希望出现的歌曲
                res = res.filter(obj => {
                    return dislikeSongIdArr.indexOf(obj.id) === -1
                });
                return shuffle(res)
            });
        } else {
            return []
            // 若找不到用户定制歌曲类别，查找所有歌曲并返回
            /*let songQuery = new AV.Query("Song");
            return songQuery.find().then(res => {
                res = res.map(obj => {
                    return {
                        ...obj.attributes,
                        id: obj.id,
                        isCollect: userCollectSongsIdObj[obj.id] ? true : false
                    };
                });
                // 过滤用户不希望出现的歌曲
                res = res.filter(obj => {
                    return dislikeSongIdArr.indexOf(obj.id) === -1
                });
                return shuffle(res)
            });*/
        }
    },
    /**
     * 获取用户收藏歌曲列表~~
     * @param userId
     * @param disableShuffle 是否禁用随机排序
     * @returns {Promise<*>}
     */
    async fetchCollectSongs(userId, disableShuffle) {
        // 查找用户收藏的歌曲id
        let userCollectSongsIdObj = await this.fetchCollectSongsIdObject(userId);
        if (!Object.keys(userCollectSongsIdObj).length) {
            return []
        }
        let songIdQuery = Object.keys(userCollectSongsIdObj).map(songId => {
            let tempQuery = new AV.Query('Song');
            tempQuery.equalTo('objectId', songId);
            return tempQuery
        });
        let combineQuery = AV.Query.or(...songIdQuery);
        return combineQuery.find().then(res => {
            console.log(res)
            res = res.map(obj => {
                return {
                    ...obj.attributes,
                    id: obj.id,
                    isCollect: true
                };
            });
            if(disableShuffle){
                return res;
            }else{
                return shuffle(res)
            }
        });
    },
    async fetchDislikeSongs(userId){
        let dislikeIdArr = await this.fetchDislikeSongsId(userId);
        console.log(dislikeIdArr)
        if(dislikeIdArr.length){
            let songQuery = dislikeIdArr.map(songObjectId=>{
                let tempQuery = new AV.Query('Song');
                tempQuery.equalTo('objectId', songObjectId)
                return tempQuery
            })
            let query = new AV.Query.or(...songQuery);
            return query.find().then(res=>{
                res = res.map(obj => {
                    return {
                        ...obj.attributes,
                        id: obj.id
                    };
                });
                return res;
            })
        }else{
            return []
        }
    },
    /**
     * 将歌曲移入某个用户下黑名单
     * @param userId {string}  用户Id
     * @param songObjectId {string} 歌曲Id
     * @returns {Promise<*>}
     */
    dislikeSong(userId, songObjectId) {
        let Rel_user_song_dislike = AV.Object.extend("Rel_user_song_dislike");
        let rel_user_song_dislike = new Rel_user_song_dislike();
        rel_user_song_dislike.set("userId", userId);
        rel_user_song_dislike.set("songId", songObjectId);
        return rel_user_song_dislike.save();
    },
    /**
     * 将歌曲移出某个用户下黑名单
     * @param userId
     * @param songObjectIdArr
     * @returns {*|Promise<T>}
     */
    undoDislikeSong(userId, songObjectIdArr) {
        let songObjectIdArrQuery = songObjectIdArr.map(songObjectId=>{
            let tempQuery = new AV.Query('Rel_user_song_dislike');
            tempQuery.equalTo("userId", userId);
            tempQuery.equalTo("songId", songObjectId);
            return tempQuery;
        });
        let query = new AV.Query.or(...songObjectIdArrQuery);
        return query.find().then(async res=>{
            await AV.Object.destroyAll(res);
            return res;
        })
    },
    /**
     * 根据objectId查找歌曲
     * @param objectId
     * @returns {any}
     */
    fetchSongByObjectId(objectId) {
        let song = new AV.Query('Song');
        return song.get(objectId)
    },
    /**
     * 用户收藏或取消收藏歌曲
     * @param {string} userId
     * @param {string} songObjectId
     * @returns {Promise<any>}
     */
    collectSong(userId, songObjectId) {
        let rel_userId_query = new AV.Query("Rel_user_collect");
        rel_userId_query.equalTo("userId", userId);
        let rel_songId_query = new AV.Query("Rel_user_collect");
        rel_songId_query.equalTo("songId", songObjectId);
        let combineQuery = AV.Query.and(rel_userId_query, rel_songId_query);
        return combineQuery.find()
            .then(async res => {
                if (res.length) {
                    // 取消收藏
                    let collectSong = AV.Object.createWithoutData('Rel_user_collect', res[0].id);
                    await collectSong.destroy();
                    return this.fetchSongByObjectId(songObjectId).then(res => {
                        return {
                            ...res.attributes,
                            id: res.id,
                            isCollect: false
                        };
                    });
                } else {
                    // 收藏
                    let Rel_user_collect = AV.Object.extend("Rel_user_collect");
                    let rel_user_collect = new Rel_user_collect();
                    rel_user_collect.set("userId", userId);
                    rel_user_collect.set("songId", songObjectId);
                    await rel_user_collect.save();
                    return this.fetchSongByObjectId(songObjectId).then(res => {
                        return {
                            ...res.attributes,
                            id: res.id,
                            isCollect: true
                        };
                    });
                }
            })
    }
};
