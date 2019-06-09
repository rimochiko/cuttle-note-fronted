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
      name: '',
      password: '',
      mail: '',
      mailTip: '邮箱',
      nameTip: '用户名',
      passwordTip: '密码',
      isNameTipHide: false,
      isPassTipHide: false,
      isMailTipHide: false,
      isSending: false,
      tipText: ''
    }
    this.changeStatus = this.changeStatus.bind(this);
  }

  async componentDidMount () {
    // 判断是否已经登录
    if(await this.props.userStore.isLogin() === true) {
      this.props.history.push('/');
      return;
    }
    document.title = "注册 - 墨鱼笔记";
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
    } else if (type === 'password') {
      this.setState({
        isPassTipHide: true
      })
    } else if (type === 'mail') {
      this.setState({
        isMailTipHide: true
      })
    }
  }

  /**
   * 判断用户输入正误
   */
  async judgeInput (type) {
    if (type === 'name') {
      if (!this.state.name) {
        this.setState({
          isNameTipHide: false,
          nameTip: '请填写用户名'
        })
        return;        
      } else if (!(/^\w{6,14}$/.test(this.state.name))) {
        this.setState({
          isNameTipHide: false,
          nameTip: '用户名应由6-14位数字字母组成'
        })
        return;
      }
      // 验证用户名是否存在
      await Qlquery.checkName({
        name: this.state.name
      })
      .then(({data}) => {
        let response = data.data.data;
        if(response.code === 0) {
          if (response.result) {
            this.setState({
                isNameTipHide: false,
                nameTip: '用户名已经存在'
            })            
          } else {
            this.setState({
              isNameTipHide: true
            })            
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }

    if (type === 'password') {
      if (!this.state.password) {
        this.setState({
          isPassTipHide: false,
          passwordTip: '请填写密码'
        })
        return;            
      } else  if (!(/^\S{6,16}$/.test(this.state.password))) {
        this.setState({
          isPassTipHide: false,
          passwordTip: '密码应由6-16位非空字符组成'
        })
        return;
      }
      this.setState({
        isPassTipHide: true
      })
    }

    if (type === 'mail') {
      let reg = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/);
      if (!this.state.mail) {
        this.setState({
          isMailTipHide: false,
          mailTip: '请填写邮箱'
        })
        return;           
      } else if (!reg.test(this.state.mail)){
        this.setState({
          isMailTipHide: false,
          mailTip: '邮箱格式错误'
        })
        return;
      }

      // 验证邮箱是否存在
      await Qlquery.checkMail({
        mail: this.state.mail
      })
      .then(({data}) => {
        let response = data.data.data;
        if (response.code === 0) {
          if(response.result) {
            this.setState({
              isMailTipHide: false,
              mailTip: '邮箱已经存在',
              isDisabled: true
            })
          } else {
            this.setState({
              isMailTipHide: true,
              isDisabled: false
            })
          }          
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

    /**
     * 判断按钮可用
     */
    judgeButtonStatus () {
      let state = this.state;
      if (state.isSending || (state.isNameTipHide && state.isPassTipHide && state.isMailTipHide)) {
        return false;
      }
      return true;
    }

  /**
   * 用户注册
   */
  async regUser() {
    this.setState({
      isSending: true
    });

    let state = this.state;
    await Qlquery.register({
      name: state.name,
      password: state.password,
      mail: state.mail
    })
    .then(({data}) => {
      // 注册成功
      let response = data.data.data;
      if (response.code === 0) {
        let res = response.result,
            user = {
              token: res.token,
              userId: res.id,
              nickname: res.nickname,
              avatar: res.avatar
            }
            console.log(user);
        this.props.userStore.logIn(user);
        this.props.history.push('/');
      } else { 
        this.setState({
          tipText: "注册失败:("
        })
        this.refs.tooltip.show()
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
            <Tooltip ref="tooltip" text={this.state.tipText} />
            <canvas id="pageBackground"></canvas>
            <div className="page-login-box">
              <div className="fixed-logo">
                <a href="#"><img src={require('../../../assets/images/logo1.png')} alt="墨鱼笔记"/></a>
              </div>
              <div className="useropt">
                <h1 className="title">注册</h1>
                <p className="des">欢迎加入我们:)</p>
                <div className="form-useropt">
                  <div className="icon-input">
                      <FontAwesomeIcon icon="envelope" />
                      <span className="tip" style={{opacity: this.state.isMailTipHide ? 0:1}}>{this.state.mailTip}</span>
                      <input style={{color: this.state.isMailTipHide ? '#666':'#fff'}}
                             type="text" 
                             value={this.state.mail} 
                             onChange={(e) => this.changeStatus(e, 'mail')}
                             onBlur={this.judgeInput.bind(this, 'mail')}
                             onFocus={this.changeTip.bind(this, 'mail')}/>
                    </div>
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
                    <button 
                           className="form-btn"
                           disabled={this.judgeButtonStatus()}
                           onClick={this.regUser.bind(this)}>注册</button>
                    <p className="form-subtext">已有账号? <Link to="/login">登录</Link></p>
                </div>
              </div>
            </div>
          </div>
        );
    }
}


export default Page;