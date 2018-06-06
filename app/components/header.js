'use strict';

import React from 'react';
import './header.less';

// header 组件
let header = React.createClass({

    // 渲染
    render(){
        return (
            <div className="header-components row">
                <img className="-col-auto" src="/resource/images/logo.png" width="40" alt="" />
                <h1 className="caption">React Music Player</h1>
            </div>
        );
    }
});
export default header;