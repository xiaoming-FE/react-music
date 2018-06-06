'use strict';

import React from 'react';
import './musiclistitem.less';
import PubSub from 'pubsub-js';

// 单个音乐item组件
let Musiclistitem = React.createClass({

    // 渲染
    render(){
        let musicItem = this.props.musicItem;
        return (
            <li onClick={this.setMusic.bind(this, musicItem)} className={`components-item row ${this.props.focus ? 'focus' : ''}`}>
                <p><strong>{musicItem.title} - {musicItem.artist}</strong></p>
                <p onClick={this.delMusic.bind(this, musicItem)} className="-col-auto delete"></p>
            </li>
        );
    },

    // 设置为播放
    setMusic(musicItem) {
        PubSub.publish('SET_MUSIC', musicItem);
    },

    // 从列表删除
    delMusic(musicItem, e) {
        e.stopPropagation();
        PubSub.publish('DEL_MUSIC', musicItem);
    }
});

export default Musiclistitem;