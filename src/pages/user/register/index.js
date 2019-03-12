import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

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
                <h1 className="title">注册</h1>
                <p className="des">欢迎加入我们:)</p>
                <form className="form-useropt">
                    <input placeholder="用户名"/>
                    <input placeholder="密码"/>
                    <input placeholder="确认密码"/>
                    <input type="submit" text="确认注册" className="form-btn"/>
                    <p className="form-subtext">已有账号? <Link to="/login">登录</Link></p>
                </form>
              </div>
            </div>
        );
    }
}

export default Page;