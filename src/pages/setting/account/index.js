import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
          <div className="wrapper-settings-detail">
            <div className="input-static-group">
              <label className="input-label">手机号码</label>
              <div className="input-static">
                <p className="input-pure-text">185******59</p>
                <button className="input-btn">更改</button>
              </div>
            </div>

            <div className="input-static-group">
              <label className="input-label">邮箱地址</label>
              <div className="input-static">
                <p className="input-static">vir***@qq.com</p>
                <button className="input-btn">更改</button>
              </div>
            </div>
            <div className="input-static-group">
              <label className="input-label">账户密码</label>
              <div className="input-static">
                <p className="input-static">已设置，可通过账户密码登录</p>
                <button className="input-btn">更改</button>
              </div>
            </div>
            <div className="input-static-group">
              <label className="input-label">个人主页</label>
              <div className="input-static">
                <p className="input-static">https://www.yuque.com/liniangao</p>
                <button className="input-btn">更改</button>
              </div>
            </div>
          </div>
        );
    }
}

export default Page;