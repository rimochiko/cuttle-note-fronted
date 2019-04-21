import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { inject, observer } from 'mobx-react';

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          name: '111111',
          password: '111111',
          nameTip: '用户名',
          passwordTip: '密码',
          isNameTipHide: false,
          isPassTipHide: false,
          isDisabled: true
        }
        this.changeStatus = this.changeStatus.bind(this);
    }

    async componentWillMount () {
      // 判断是否已经登录
      if(await this.props.userStore.isLogin() === true) {
        this.props.history.push('/'); 
      }
      document.title = "登录 - 墨鱼笔记";
    }

    componentDidMount() {
      this.drawBackground();
    }

    drawBackground () {
      let cvs = document.getElementById('pageBackground'),
          width = window.innerWidth,
          height = window.innerHeight,
          circleNum = 15;
      cvs.width = width;
      cvs.height = height;
      
      let ctx = cvs.getContext('2d');

      for (let i = 0; i < circleNum; i++){
        let x = Math.random()*width,
            y = Math.random()*height,
            r = Math.random()*80 + 10;
        ctx.beginPath();
        ctx.arc(x,y,r,0,2*Math.PI,true);
        ctx.fillStyle="rgba(255, 255, 255, .1)";
        ctx.fill();
        ctx.closePath();
      }
    }
    
    /**
     * 监听输入
     */
    changeStatus (e, stateName) {
      let state = {};
      state[stateName] = e.target.value;
      this.setState(state)
    }

    changeTip (type) {
      if (type === 'name') {
        this.setState({
          isNameTipHide: true
        })
      } else {
        this.setState({
          isPassTipHide: true
        })
      }
    }

    /**
     * 判断用户输入正误
     */
    judgeInput (type) {
      if (type === 'name' && !this.state.name) {
        this.setState({
          isNameTipHide: false,
          nameTip: '请填写用户名',
          isDisabled: true
        })
        return;
      }

      if (type === 'password' && !this.state.password) {
        this.setState({
          isPassTipHide: false,
          passwordTip: '请填写密码',
          isDisabled: true
        })
        return;    
      }
      this.setState({
        isDisabled: false
      })
    }

      /**
   * 用户登录
   */
  loginUser() {
    const query = `
    mutation {
      data:
      userLogin(
       userId: \"${this.state.name}\",
       password: \"${this.state.password}\") {
         code,
         token,
         userId,
         avatar,
         nickname
       }
     }`;
      
    axios.post('/graphql', {query})
    .then(({data}) => {
      // 登录成功
      let res = data.data.data;
      console.log(res);
      if (res.code === 1) {
        let user = {
          token: res.token,
          userId: res.userId,
          nickname: res.nickname,
          avatar: res.avatar
        }
        this.props.userStore.logIn(user);
        this.props.history.push('/');
      } else {
        this.setState({
          isPassTipHide: false,
          passwordTip: '密码填写错误',
          isDisabled: true
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

    render () {
        return (
          <div className="page-login">
            <canvas id="pageBackground"></canvas>
            <div className="page-login-box">
              <div className="fixed-logo">
                <img src={require('../../../assets/images/logo1.png')} alt="墨鱼笔记"/>
              </div>
              <div className="useropt">
                <h1 className="title">登录</h1>
                <p className="des">欢迎回来:)</p>
                <div className="form-useropt">
                    <div className="icon-input">
                      <FontAwesomeIcon icon="user" />
                      <span className="tip" style={{opacity: this.state.isNameTipHide ? 0:1}}>{this.state.nameTip}</span>
                      <input style={{color: this.state.isNameTipHide ? '#666':'#fff'}}
                             type="text" 
                             value={this.state.name} 
                             onChange={(e) => this.changeStatus(e, 'name')}
                             onBlur={this.judgeInput.bind(this, 'name')}
                             onFocus={this.changeTip.bind(this, 'name')}/>
                    </div>
                    <div className="icon-input">
                      <FontAwesomeIcon icon="key" />
                      <span className="tip" style={{opacity: this.state.isPassTipHide ? 0:1}}>{this.state.passwordTip}</span>
                      <input style={{color: this.state.isPassTipHide ? '#666':'#fff'}} 
                             type="password" 
                             value={this.state.password} 
                             onChange={(e) => this.changeStatus(e, 'password')}
                             onBlur={this.judgeInput.bind(this, 'password')}
                             onFocus={this.changeTip.bind(this, 'password')}/>
                    </div>
                    
                    <div className="other-login">
                      <a href="#">忘记密码？</a>
                      <p>三方登录 <FontAwesomeIcon icon={["fab","qq"]} />
                      <FontAwesomeIcon icon={["fab","weibo"]} />
                      <FontAwesomeIcon icon={["fab","weixin"]} /></p>
                    </div>
                    <button 
                           className="form-btn" 
                           disabled={this.state.isDisabled}
                           onClick={this.loginUser.bind(this)}>登录</button>
                    <p className="form-subtext">还没有账号? <Link to="/register">注册</Link></p>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default Page;