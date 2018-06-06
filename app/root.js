'use strict';

import React from 'react';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musiclist';
import { MUSIC_LIST } from './config/musiclist';
import {Router, IndexRoute, Link, Route, hashHistory} from 'react-router';
import PubSub from 'pubsub-js';

// 页面app组件
let app = React.createClass({

    // 设置默认状态值
    getInitialState(){
        return {
            musiclist: MUSIC_LIST,
            currentMusic: MUSIC_LIST[0],
            isPlay: false,
            playType: 'cycle'
        }
    },

    // 渲染
    render(){
        return (
            <div>
                <Header />
                {React.cloneElement(this.props.children,this.state)}
            </div>
        );
    },

    // 播放音乐
    playMusic(musicItem) {
        $('#player').jPlayer('setMedia', {
            mp3: musicItem.file
        }).jPlayer(`${this.state.isPlay ? 'play' : 'pause'}`);
        this.setState({
            currentMusic: musicItem
        });
    },

    // 切换播放音乐
    next(type = 'next'){
        let index = this.findMusicIndex(this.state.currentMusic);
        let musicListLength = this.state.musiclist.length;
        let newindex = null;
        if (type === 'next') {
            newindex = (index + 1) % musicListLength;
        } else {
            newindex = (index - 1 + musicListLength) % musicListLength;
        }
        this.playMusic(this.state.musiclist[newindex]);
    },

    // 歌曲变动模式
    changePlayNext(){
        if (this.state.playType === 'once') {
            this.playMusic(this.state.currentMusic);
        } else if (this.state.playType === 'random'){
            let index = this.findMusicIndex(this.state.currentMusic);
            let newindex = this.randomIndex(this.state.musiclist.length - 1);
            while (index == newindex) {
                this.randomIndex(this.state.musiclist.length - 1);
            };
            this.playMusic(this.state.musiclist[newindex]);
        } else {
            this.next();
        }
    },

    // 获取随机索引
    randomIndex(max){
        return Math.ceil(Math.random() * max);
    },

    // 获取index索引
    findMusicIndex(musicItem) {
        let index = this.state.musiclist.indexOf(musicItem);
        return Math.max(0, index);
    },

    // 组件渲染后
    componentDidMount() {
        // 初始化播放参数
        $('#player').jPlayer({
            supplied: 'mp3',
            wmode: 'window',
            useStateClassSkin: true,
            volume: 0.5
        });

        // 初始化播放
        this.playMusic(this.state.currentMusic);

        // 绑定播放结束事件
        $('#player').bind($.jPlayer.event.ended, (e) => {
            this.changePlayNext();
        });

        // 设为播放音乐
        PubSub.subscribe('SET_MUSIC', (msg, musicItem) =>{
            this.playMusic(musicItem);
        });

        // 删除音乐
        PubSub.subscribe('DEL_MUSIC', (msg, musicItem) =>{
            this.setState({
                musiclist: this.state.musiclist.filter(item => {
                    return item !== musicItem;
                })
            });
        });

        // 设置下一首
        PubSub.subscribe('NEXT_MUSIC', () =>{
            this.next();
        });

        // 设置上一首
        PubSub.subscribe('PREV_MUSIC', () =>{
            this.next('prev');
        });

        // 播放状态
        PubSub.subscribe('PLAY_STATE', (msg, state) =>{
            this.setState({
                isPlay: !state
            });
        });

        // 播放类型
        let playTypeList = [
            'cycle',
            'once',
            'random'
        ];

        // 循环类型
        PubSub.subscribe('PLAY_TYPE', () =>{
            let index = playTypeList.indexOf(this.state.playType);
            index = (index + 1) % playTypeList.length;
            this.setState({
                playType: playTypeList[index]
            });
        });

    },

    // 组件销毁
    componentWillUnmount() {
        // 解绑事件
        PubSub.unsubscribe('DEL_MUSIC');
        PubSub.unsubscribe('SET_MUSIC');
        PubSub.unsubscribe('NEXT_MUSIC');
        PubSub.unsubscribe('PREV_MUSIC');
        PubSub.unsubscribe('PLAY_STATE');
        PubSub.unsubscribe('PLAY_TYPE');
        $('#player').unbind($.jPlayer.event.ended);
    }
});

// 管理页面组件
let root = React.createClass({
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={app}>
                    <IndexRoute component={Player}/>
                    <Route path="/list" component={MusicList} />
                </Route>
            </Router>
        );
    }
});
export default root;