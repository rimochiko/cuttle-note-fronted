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
      name: '',
      password: '',
      mail: '',
      mailTip: '邮箱',
      nameTip: '用户名',
      passwordTip: '密码',
      isNameTipHide: false,
      isPassTipHide: false,
      isMailTipHide: false,
      isDisabled: true
    }
    this.changeStatus = this.changeStatus.bind(this);
  }

  async componentWillMount () {
    // 判断是否已经登录
    if(await this.props.userStore.isLogin() === true) {
      this.props.history.push('/'); 
    }
    document.title = "注册 - 墨鱼笔记";
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
  judgeInput (type) {
    if (type === 'name') {
      if (!this.state.name) {
        this.setState({
          isNameTipHide: false,
          nameTip: '请填写用户名',
          isDisabled: true
        })
        return;        
      } else if (!(/^\w{6,14}$/.test(this.state.name))) {
        this.setState({
          isNameTipHide: false,
          nameTip: '用户名应由6-14位数字字母组成',
          isDisabled: true
        })
        return;
      }
      // 验证用户名是否存在
      const query = `query {
            isExist:
            isUserNone(userId: "${this.state.name}")}`;

      axios.post('/graphql', {query})
      .then(({data}) => {
        if(data.data.isExist === 1) {
          this.setState({
              isNameTipHide: false,
              nameTip: '用户名已经存在',
              isDisabled: true
          })
        } else {
          this.setState({
            isNameTipHide: true
          })
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
          passwordTip: '请填写密码',
          isDisabled: true
        })
        return;            
      } else  if (!(/^\S{6,16}$/.test(this.state.password))) {
        this.setState({
          isPassTipHide: false,
          passwordTip: '密码应由6-16位非空字符组成',
          isDisabled: true
        })
        return;
      }
      this.setState({
        isPassTipHide: true
      })
    }

    if (type === 'mail') {
      let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      if (!this.state.mail) {
        this.setState({
          isMailTipHide: false,
          mailTip: '请填写邮箱',
          isDisabled: true
        })
        return;           
      } else if (!reg.test(this.state.mail)){
        this.setState({
          isMailTipHide: false,
          mailTip: '邮箱格式错误',
          isDisabled: true        
        })
        return;
      }
      // 验证邮箱是否存在
      const query = `query {
        isExist:
        isMailNone(mail: "${this.state.mail}")}`;
        
      axios.post('/graphql', {query})
      .then(({data}) => {
        //console.log(data);
        if(data.data.isExist === 1) {
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
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  /**
   * 用户注册
   */
  regUser() {
    const { dispatch } = this.props
    const query = `
      mutation {
        data:
        userSave(
          userId: "${this.state.name}",
          password: "${this.state.password}",
          mail: "${this.state.mail}"
        ) {
          token,
          userId,
          avatar,
          nickname,
          code
        }
      }`;
      
    axios.post('/graphql', {query})
    .then(({data}) => {
      // 注册成功
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
                <a href="#"><img src={require('../../../assets/images/logo1.png')}/></a>
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
                           disabled={this.state.isDisabled}
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