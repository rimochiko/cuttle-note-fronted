import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link, NavLink} from 'react-router-dom';
import config from './config';
import './sidebar.scss';
import axios from 'axios';

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
          isBarOpen: true,
          user: {
            nickname: '',
            username: '',
            avatar: '',
            des: ''
          }
        }
        this.toggleBar = this.toggleBar.bind(this);
    }

    componentWillMount() {
      let user = JSON.parse(window.localStorage.getItem('user'));
      this.setState({
        user: {
          nickname: user.nickname,
          username: user.username,
          avatar: user.avatar ? user.avatar : require('../../assets/images/default.jpg')
        }
      })
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
                      <img src={this.state.user.avatar} className="header-avatar"/>
                  </div>
                  <ul className="ul-nav">
                  {
                      config.map((item) => {
                        return <li key={item.name}  className="li-nav">
                            <NavLink to={item.url} 
                                     className="link-nav" 
                                     title={item.text} 
                                     activeClassName="active">
                                <FontAwesomeIcon icon={item.icon} 
                                                 className="link-icon"/>
                            </NavLink>
                        </li>
                      })
                  }
                  </ul>
 
                </div>
                <ul className="ul-nav">
                  <li className="li-nav">
                    <NavLink to="/collect"
                             className="link-nav" 
                             title="收藏夹" 
                             activeClassName="active">
                        <FontAwesomeIcon icon={['far','star']} className="link-icon"/>
                    </NavLink>
                  </li>
                  <li className="li-nav">
                    <NavLink to="/trash" 
                             className="link-nav" 
                             title="回收站" 
                             activeClassName="active">
                        <FontAwesomeIcon icon={['far','trash-alt']} className="link-icon"/>
                    </NavLink>
                  </li>
                </ul>                 
                <div className="author-panel"  style={{display: this.state.barStyle}}>
                  <div className="header">
                    <p>我的资料</p>
                    <span><FontAwesomeIcon icon="times" onClick={this.toggleBar.bind(this)}/></span>
                  </div>
                  <div className="profile">
                    <img src={this.state.user.avatar} className="avatar"/>
                    <p className="name">{this.state.user.nickname}</p>
                    <p className="des">{this.state.user.des || '暂无个人简介'}</p>
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
                    <NavLink to="/setting" className="radius-btn input-btn"><FontAwesomeIcon icon="cog" />账号设置</NavLink>
                    <NavLink to="/login" className="radius-btn input-btn"><FontAwesomeIcon icon="sign-out-alt" />退出登录</NavLink>
                  </div>
                </div>
              </div>
        );
    }
}

export default Sidebar;