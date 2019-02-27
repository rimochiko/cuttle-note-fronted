import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="page-login">
              <div className="wrapper-fixed-logo">
                <a href="#"><img src={require('../../../assets/images/logo1.png')}/></a>
              </div>
              <div className="wrapper-useropt">
                <h1 className="title">登录</h1>
                <p className="des">欢迎回来:)</p>
                <form className="form-useropt">
                    <input placeholder="用户名"/>
                    <input placeholder="密码"/>
                    <div className="other-login">
                      <a href="#">忘记密码？</a>
                      <p>三方登录：<FontAwesomeIcon icon="qq" /><FontAwesomeIcon icon="weibo" /><FontAwesomeIcon icon="wechat" /></p>
                    </div>
                    <input type="submit" text="登录" className="form-btn"/>
                    <p className="form-subtext">还没有账号? <a href="#">注册</a></p>
                </form>
              </div>
            </div>
        );
    }
}

export default Page;