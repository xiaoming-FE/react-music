'use strict';

import React from 'react';
import Progress from '../components/progress';
import './player.less';
import {Link} from 'react-router';
import PubSub from 'pubsub-js';

let duration = null;

// 播放器组件
let Player = React.createClass({

    // 设置默认状态值
    getInitialState(){
        return {
            progress: 0,
            volume: 0,
            isPlay: false,
            timestr: ''
        }
    },
    // 渲染
    render(){
        return (
            <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                    <div className="controll-wrapper">
                        <h2 className="music-title">{this.props.currentMusic.title}</h2>
                        <h3 className="music-artist mt10">{this.props.currentMusic.artist}</h3>
                        <div className="row mt20">
                            <div className="left-time -col-auto">-{this.state.timestr}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                                <div className="volume-wrapper">
                                    <Progress progress={this.state.volume}
                                    onProgressChange={this.changeVolumeHandler}
                                    barColor="#aaa"/>
                                </div>
                            </div>
                        </div>
                        <div style={{height: 10, lineHeight: '10px', marginTop: '20px'}}>
                            <Progress progress={this.state.progress}
                            onProgressChange={this.progressChangeHandler}/>
                        </div>
                        <div className="mt35 row">
                            <div>
                                <i className="icon prev" onClick={this.prev}></i>
                                <i className={`icon ml20 ${this.state.isPlay ? 'pause': 'play'}`} onClick={this.play}></i>
                                <i className="icon next ml20" onClick={this.next}></i>
                            </div>
                            <div className="-col-auto">
                                <i className={`icon repeat-${this.props.playType}`} onClick={this.setPlayType}></i>
                            </div>
                        </div>
                    </div>
                    <div className="-col-auto cover">
                        <img src={this.props.currentMusic.cover} alt={this.props.currentMusic.title}/>
                    </div>
                </div>
            </div>
        );
    },

    // 组件完成渲染后
    componentDidMount() {
        // 绑定播放器事件
        $('#player').bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
                volume: e.jPlayer.options.volume * 100,
                progress: e.jPlayer.status.currentPercentAbsolute,
                timestr: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
            });
        })
    },

    // 组件销毁后
    componentWillUnmount(){
        $('#player').unbind($.jPlayer.event.timeupdate);
    },

    // 格式化时间
    formatTime(time){
        let timestr = Math.floor(time);
        let miniutes = Math.floor(time/60);
        let seconds = Math.floor(time%60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return `${miniutes}:${seconds}`;
    },

    // 设置播放进度
    progressChangeHandler(progress) {
        let status = 'play';
        if (!this.state.isPlay) {
            status = 'pause';
        }
        $('#player').jPlayer(status, duration * progress);
    },

    // 设置音量进度
    changeVolumeHandler(progress){
        $('#player').jPlayer('volume', progress);
        this.setState({
            volume: progress * 100
        });
    },

    // 播放和暂停
    play() {
        if (this.state.isPlay) {
            $('#player').jPlayer('pause');
        } else {
            $('#player').jPlayer('play');
        }
        this.setState({
            isPlay: !this.state.isPlay
        });
        PubSub.publish('PLAY_STATE', this.state.isPlay);
    },

    // 下一首
    next() {
        PubSub.publish('NEXT_MUSIC');
    },

    // 上一首
    prev() {
        PubSub.publish('PREV_MUSIC');
    },

    // 切换播放类型
    setPlayType() {
        PubSub.publish('PLAY_TYPE');
    }
});

export default Player;