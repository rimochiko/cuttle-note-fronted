import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link, NavLink, withRouter} from 'react-router-dom';
import config from './config';
import './sidebar.scss';
import { inject, observer } from 'mobx-react';
import {CSSTransition} from 'react-transition-group';

@inject('userStore')
@observer
class Sidebar extends Component {
    constructor () {
        super();
        this.state = {
          isBarOpen: false
        }
        this.toggleBar = this.toggleBar.bind(this);
        this.getFans = this.getFans.bind(this);
        this.getFollow = this.getFollow.bind(this);
    }

    toggleBar () {
      console.log(this.state.isBarOpen)
      this.setState({
        isBarOpen: !this.state.isBarOpen,
      });
    }

    logOut () {
      this.props.userStore.logOut();
      this.props.history.push('/login');
    }

    getFollow () {
      let userStore = this.props.userStore;
      if (userStore && userStore.follows.length) {
        return (
          <ul>
            {
              userStore.follows.map((item) => (
                <li key={item.id}>
                  <Link to='/'>
                    <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` : require('../../assets/images/default.jpg')}
                        alt={item.id}/>
                  </Link>
                </li>
              ))
            }
            {
              userStore.follows.length > 5 ?
              <li>+{userStore.follows.length}</li> : ''
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
      let userStore = this.props.userStore;
      if (userStore && userStore.fans.length) {
        return (
          <ul>
          {
              userStore.fans.map((item) => (
                <li key={item.id}>
                  <Link to='/'>
                  <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` :require('../../assets/images/default.jpg')}
                        alt={item.id}/>
                  </Link>
                </li>
              ))
            }
            {
              userStore.fans.length > 5 ?
              <li>+{userStore.fans.length}</li> : ''
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

    componentDidMount () {
      this.boxDOM = ReactDOM.findDOMNode(this.refs.sidebar);
    }

    render () {
        let user = (this.props.userStore && this.props.userStore.user)|| {
          nickname: '',
          userId: '',
          des: '',
          avatar: ''
        }; 

        return (
            <div className="public-sidebar">
              <div className="header">
                  <div className="logo" onClick={this.toggleBar}>
                      <img src={user.avatar ? user.avatar : require('../../assets/images/default.jpg')} 
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
                <CSSTransition 
                    in={this.state.isBarOpen} 
                    classNames="modal" timeout={300}
                    onEnter={()=>{
                        this.boxDOM.style.display = "block";
                    }}
                    onExited={()=>{
                        this.boxDOM.style.display = "none";
                    }}
                >              
                <div className="author-panel" ref="sidebar">
                  <div className="header">
                    <p>我的资料</p>
                    <span><FontAwesomeIcon icon="times" onClick={this.toggleBar.bind(this)}/></span>
                  </div>
                  <div className="profile">
                  <img src={user.avatar ? user.avatar : require('../../assets/images/default.jpg')} 
                       className="avatar" alt={user.userId}/>
                    <p className="name">{user.nickname || ''}</p>
                    <p className="des">{user.des || '暂无个人简介'}</p>
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
                </CSSTransition>
              </div>
        );
    }
}

export default withRouter(Sidebar);