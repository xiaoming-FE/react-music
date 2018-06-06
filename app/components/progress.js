'use strict';

import React from 'react';
import './progress.less';

// 进度条组件
var progress = React.createClass({

    // 初始化进度颜色
    getDefaultProps(){
        return {
            barColor: '#2f9842'
        }
    },

    // 渲染
    render(){
        return (
            <div className="progress-components" ref="progressBar" onClick={this.changeProgress}>
                <div className="progress" style={{width: `${this.props.progress}%`,
                background: this.props.barColor}}></div>
            </div>
        );
    },

    // 设置播放进度
    changeProgress(e) {
        let progressBar = this.refs.progressBar;
        let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.props.onProgressChange && this.props.onProgressChange(progress);
    }
});

export default progress;
