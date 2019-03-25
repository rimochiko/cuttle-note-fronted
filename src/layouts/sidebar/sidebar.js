import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom';
import config from './config';
import './sidebar.scss';
import DropDown from '../../components/dropdown';
let dropMenudata = [{
    id: 1,
    text: '我的主页',
    link: '/',
    icon: 'user'
}, {
    id: 2,
    text: '账号设置',
    link: '/setting',
    icon: 'cog'
}, {
    id: 3,
    text: '退出',
    link: '/login',
    icon: 'sign-out-alt'
}]

class Sidebar extends Component {
    constructor () {
        super();
        this.state = {
          isBarOpen: true
        }
        this.toggleBar = this.toggleBar.bind(this);
    }

    toggleBar () {
      this.setState(prevState => ({
        isBarOpen: !prevState.isBarOpen,
        barStyle: this.state.isBarOpen? 'block': 'none'  
      }));
    }

    render () {
        return (
            <div className="public-sidebar">
              <div className="header">
                <div className="logo" onClick={this.toggleBar}>
                    <img src={require('../../assets/images/avatar.jpg')} className="header-avatar"/>
                </div>
                <ul className="ul-nav">
                {
                    config.map((item, index) => {
                            return <li key={item.name}  className="li-nav">
                                <Link to={item.url} className="link-nav" title={item.text}>
                                    <FontAwesomeIcon icon={item.icon} className="link-icon"/>
                                </Link>
                            </li>
                    })
                }
                </ul>
                <div className="author-panel"  style={{display: this.state.barStyle}}>
                  <div className="header">
                    <p>我的资料</p>
                    <span><FontAwesomeIcon icon="times"/></span>
                  </div>
                  <div className="profile">
                    <img src={require('../../assets/images/avatar.jpg')} className="avatar"/>
                    <p className="name">九月的风</p>
                    <p className="des">没什么好说的...</p>
                    <div className="list">
                      <span>我的关注</span>
                      <ul>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar1.jpg')}/>
                        </Link></li>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar2.jpg')}/>
                        </Link></li>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar3.jpg')}/>
                        </Link></li>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar5.jpg')}/>
                        </Link></li>
                        <li>+16</li>
                      </ul>
                    </div>

                    <div className="list">
                      <span>我的粉丝</span>
                      <ul>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar3.jpg')}/>
                        </Link></li>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar2.jpg')}/>
                        </Link></li>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar6.jpg')}/>
                        </Link></li>
                        <li><Link to="/">
                          <img src={require('../../assets/images/avatar4.jpg')}/>
                        </Link></li>
                        <li>+34</li>
                      </ul>
                    </div>
                    
                  </div>
                  <div className="option">
                    <Link to="/setting" className="radius-btn input-btn"><FontAwesomeIcon icon="cog" />账号设置</Link>
                    <Link to="/login" className="radius-btn input-btn"><FontAwesomeIcon icon="sign-out-alt" />退出登录</Link>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

export default Sidebar;