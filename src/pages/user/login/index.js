import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Tooltip from '../../../components/tooltip';
import Tool from '../tool';
import Qlquery from '../graphql';

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
          isLoging: false,
          tipText: '',
          loginText: '登录'
        }
        this.changeStatus = this.changeStatus.bind(this);
    }

    async componentDidMount() {
      // 判断是否已经登录
      if(await this.props.userStore.isLogin() === true) {
        this.props.history.push('/');
        return;
      }
      document.title = "登录 - 墨鱼笔记";
      Tool.drawBackground();
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
          nameTip: '请填写用户名'
        })
        return;
      }

      if (type === 'password' && !this.state.password) {
        this.setState({
          isPassTipHide: false,
          passwordTip: '请填写密码'
        })
        return;    
      }
    }

    /**
     * 判断登录按钮可用
     */
    judgeButtonStatus () {
      let state = this.state;
      if ((state.isNameTipHide && state.isPassTipHide) || state.isLoging) {
        return false;
      }
      return true;
    }

      /**
   * 用户登录
   */
  async loginUser() {
    this.setState({
      isLoging: true,
      loginText: '...'
    });

    await Qlquery.login({
      name: this.state.name,
      password: this.state.password
    })
    .then(({data}) => {
      // 登录成功
      let res = data.data.data;
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
          tipText: "密码或用户名错误",
          isLoging: false,
          loginText: '登录'
        })
        this.refs.tooltip.show();
      }
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        tipText: "服务器出现故障:("
      })
      this.refs.tooltip.show()
    })
  }

    render () {
        return (
          <div className="page-login">
            <Tooltip text={this.state.tipText} ref="tooltip"/>
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
                      <span className="tip" 
                            style={{opacity: this.state.isNameTipHide ? 0:1}}>
                            {this.state.nameTip}
                      </span>
                      <input style={{color: this.state.isNameTipHide ? '#666':'#fff'}}
                             type="text" 
                             value={this.state.name} 
                             onChange={(e) => this.changeStatus(e, 'name')}
                             onBlur={this.judgeInput.bind(this, 'name')}
                             onFocus={this.changeTip.bind(this, 'name')}/>
                    </div>
                    <div className="icon-input">
                      <FontAwesomeIcon icon="key" />
                      <span className="tip" 
                            style={{opacity: this.state.isPassTipHide ? 0:1}}>
                            {this.state.passwordTip}
                      </span>
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
                           disabled={this.judgeButtonStatus()}
                           onClick={this.loginUser.bind(this)}>{this.state.loginText}</button>
                    <p className="form-subtext">还没有账号? <Link to="/register">注册</Link></p>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default Page;