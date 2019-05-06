import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Qlquery from '../graphql';

import { inject, observer } from 'mobx-react';

@inject('userStore', 'postStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          nickname: '',
          des: '',
          sex: 0,
          location: '',
          avatar: '',
          tNickname: '',
          tDes: '',
          tSex: 0,
          tLocation: '',
          tAvatar: ''
        }
    }

    async componentWillMount() {
      // 请求用户资料
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
      }

      await Qlquery.getProfile({
        id: this.props.userStore.user.userId
      })
      .then(({data})=> {
        let res = data.data.data;
        this.setState({
          nickname: res.nickname,
          des: res.des,
          sex: res.sex,
          location: res.location,
          avatar: res.avatar
        })
      })

      this.props.toggleLoading();
    }
    updateProfile () {
      Qlquery.updateProfile({
        token: this.props.userStore.user.token,
        userId: this.props.userStore.user.userId,
        nickname: this.state.tNickname,
        des: this.state.tDes,
        avatar: this.state.tAvatar,
        sex: this.state.tSex,
        location: this.state.tLocation
      })
      .then(({data}) => {
        let res = data.data.data;
        if (res === 1) {
          // 修改成功
        }
      })
    }

    resetProfile () {
      this.setState({
        tNickname: '',
        tDes: '',
        tSex: 0,
        tLocation: '',
        tAvatar: ''
      })
    }

    render () {
        return (
          <div className="settings-detail">
            <div className="flex-row">
               <div className="flex-1">
                    <div className="input-group">
                      <label className="input-label">昵称</label>
                      <input className="input-text" 
                            type="text" 
                            placeholder="请输入昵称"
                            defaultValue={this.state.nickname}
                            onChange={(e) => {
                              this.setState({
                                tNickname: e.target.value
                              })
                            }}/>
                      <span className="input-mark">必填项</span>
                    </div>

                    <div className="input-group">
                      <label className="input-label">性别</label>
                      <div className="radio-group" onChange={(e) => {
                        this.setState({
                          tSex: e.target.value
                        })
                      }}>
                        <input type="radio"
                              value="0" 
                              name="sex" 
                              defaultChecked={this.state.sex === 0}/><span>男</span>
                        <input type="radio" 
                              value="1" 
                              name="sex" 
                              defaultChecked={this.state.sex === 1}/><span>女</span>
                      </div>
                      <span className="input-mark">必填项</span>
                    </div>

                    <div className="input-group">
                      <label className="input-label">所在地</label>
                      <input className="input-text" 
                            type="text" 
                            placeholder="请输入所在地"
                            defaultValue={this.state.location}
                            onChange={(e)=>{
                              this.setState({
                                tLocation: e.target.value
                              })
                            }}/>
                      <span className="input-mark">非必填项</span>
                    </div>

                    <div className="input-group">
                      <label className="input-label">个人简介</label>
                      <textarea className="input-area" 
                                type="text" 
                                placeholder="快来介绍介绍自己吧，50字以内"
                                defaultValue={this.state.des}
                                onChange={(e)=>{
                                  this.setState({
                                    tDes: e.target.value
                                  })
                                }}/>/>
                      <span className="input-mark">非必填项</span>
                    </div>
                </div>  

                <div className="input-group">
                    <label className="input-label">头像</label>
                    <div className="two-side">
                        <img src={this.state.tAvatar || this.state.avatar || require('../../../assets/images/avatar.jpg')} 
                            className="input-img"
                            alt=""/>
                        <div className="input-file-box">
                            <input className="file-input" 
                                  type="file"
                                  accept="image/jpeg,image/x-png"
                                  onChange={(e) => {
                                      let file = e.target.files[0],
                                          reader = new FileReader();
                                      reader.readAsDataURL(file);
                                      reader.onload = (e) => {
                                        this.setState({
                                          tAvatar: e.target.result
                                        })
                                      } 
                                  }}/>
                            <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                        </div>
                    </div>
                    <span className="input-mark">非必填项</span>
                  </div>                          
            </div>
          
            <div className="input-group">
              <input className="sub-btn radius-btn margin-btn"
                     type="reset" 
                     text="重置"
                     onClick={this.resetProfile.bind(this)} />
              <input className="input-btn radius-btn" 
                     type="submit" 
                     text="确认"
                     onClick={this.updateProfile.bind(this)} />
            </div>
          </div>
        );
    }
}

export default Page;