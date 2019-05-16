import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link, NavLink, withRouter} from 'react-router-dom';
import config from './config';
import './sidebar.scss';
import { inject, observer } from 'mobx-react';

@inject('userStore')
@observer
class Sidebar extends Component {
    constructor () {
        super();
        this.state = {
          isBarOpen: true,
          user: {
            nickname: '',
            userId: '',
            avatar: require('../../assets/images/default.jpg'),
            des: '',
            follow: [],
            fans: []
          }
        }
        this.toggleBar = this.toggleBar.bind(this);
        this.getFans = this.getFans.bind(this);
        this.getFollow = this.getFollow.bind(this);
    }

    componentDidMount () {
    }

    componentWillReceiveProps () {
      if (this.props.userStore.user.userId) {
        let userStore = this.props.userStore;
        let user = userStore.user;

        this.setState({
          user: {
            nickname: user.nickname,
            userId: user.userId,
            avatar: user.avatar ? user.avatar : require('../../assets/images/default.jpg'),
            fans: userStore.fans,
            follow: userStore.follows
          }
        })
      }
    }

    toggleBar () {
      this.setState(prevState => ({
        isBarOpen: !prevState.isBarOpen,
        barStyle: this.state.isBarOpen? 'block': 'none'  
      }));
    }

    logOut () {
      this.props.userStore.logOut();
      this.props.history.push('/login');
    }

    getFollow () {
      if (this.state.user.follow && this.state.user.follow.length) {
        return (
          <ul>
            {
              this.state.user.follow.map((item) => (
                <li key={item.id}>
                  <Link to='/'>
                    <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` : require('../../assets/images/default.jpg')}
                        alt={item.id}/>
                  </Link>
                </li>
              ))
            }
            {
              this.state.user.follow.length > 5 ?
              <li>+{this.state.user.follow.length}</li> : ''
            }
          </ul>
        )
      } else {
        return (
          <div className="side-list-none">
            无
          </div>
        )
      }
    }

    getFans () {
      if (this.state.user.fans && this.state.user.fans.length) {
        return (
          <ul>
          {
              this.state.user.fans.map((item) => (
                <li key={item.id}>
                  <Link to='/'>
                  <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` :require('../../assets/images/default.jpg')}
                        alt={item.id}/>
                  </Link>
                </li>
              ))
            }
            {
              this.state.user.fans.length > 5 ?
              <li>+{this.state.user.fans.length}</li> : ''
            }
          </ul>
        )
      } else {
        return (
          <div className="side-list-none">
          无
          </div>
        )
      }
    }

    render () {
        return (
            <div className="public-sidebar">
              <div className="header">
                  <div className="logo" onClick={this.toggleBar}>
                      <img src={this.state.user.avatar} 
                           className="header-avatar"
                           alt=""/>
                  </div>
                  <ul className="ul-nav">
                  {
                      config.map((item) => {
                        return <li key={item.name}  className="li-nav">
                            <NavLink exact={item.isExact}
                                     to={item.url} 
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
                    <img src={this.state.user.avatar} className="avatar" alt={this.state.user.id}/>
                    <p className="name">{this.state.user.nickname}</p>
                    <p className="des">{this.state.user.des || '暂无个人简介'}</p>
                    <div className="list">
                      <span>我的关注</span>
                      {
                        this.getFollow()
                      }
                    </div>

                    <div className="list">
                      <span>我的粉丝</span>
                      {
                        this.getFans()
                      }
                    </div>
                    
                  </div>
                  <div className="option">
                    <Link to="/setting" className="radius-btn input-btn"><FontAwesomeIcon icon="cog" />账号设置</Link>
                    <button className="radius-btn input-btn" onClick={this.logOut.bind(this)}><FontAwesomeIcon icon="sign-out-alt"/>退出登录</button>
                  </div>
                </div>
              </div>
        );
    }
}

export default withRouter(Sidebar);