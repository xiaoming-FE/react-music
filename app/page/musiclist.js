'use strict';

import React from 'react';
import Musiclistitem from '../components/musiclistitem';
// 音乐列表组件
let MusicList = React.createClass({

    // 渲染
    render() {
        let listEle = null;
        listEle = this.props.musiclist.map((item) => {
            return (
                <Musiclistitem
                    focus={item === this.props.currentMusic}
                    key={item.id}
                    musicItem={item}/>
            )
        });

        return(
            <ul>
                {listEle}
            </ul>
        );
    }
});

export default MusicList;