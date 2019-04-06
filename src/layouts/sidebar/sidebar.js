import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom';
import config from './config';
import './sidebar.scss';

let profile = {
  avatar: require('../../assets/images/avatar.jpg'),
  nickname: '九月的风',
  des: 'Nothing...',
  fansCount: 32,
  fans: [{
    id: 'test1',
    avatar: require('../../assets/images/avatar1.jpg') 
  }, {
    id: 'test2',
    avatar: require('../../assets/images/avatar1.jpg') 
  }, {
    id: 'test3',
    avatar: require('../../assets/images/avatar1.jpg') 
  }],
  followCount: 21,
  follow: [{
    id: 'test1',
    avatar: require('../../assets/images/avatar1.jpg') 
  }, {
    id: 'test2',
    avatar: require('../../assets/images/avatar1.jpg') 
  }, {
    id: 'test3',
    avatar: require('../../assets/images/avatar1.jpg') 
  }]
}

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
                    <img src={profile.avatar} className="header-avatar"/>
                </div>
                <ul className="ul-nav">
                {
                    config.map((item) => {
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
                    <img src={profile.avatar} className="avatar"/>
                    <p className="name">{profile.nickname}</p>
                    <p className="des">{profile.des}</p>
                    <div className="list">
                      <span>我的关注</span>
                      <ul>
                        {
                          profile.fans.map((item) => (
                            <li key={item.id}>
                              <Link to='/'>
                                <img src={item.avatar}
                                    title={item.id}/>
                              </Link>
                            </li>
                          ))
                        }
                        
                        <li>+{profile.fansCount}</li>
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