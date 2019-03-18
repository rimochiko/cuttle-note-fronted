import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
          <div className="wrapper-settings-detail">
            <div className="input-group">
              <label className="input-label">昵称</label>
              <input className="input-text" type="text" placeholder="请输入昵称"/>
              <span className="input-mark">必填项</span>
            </div>

            <div className="input-group">
              <label class="input-label">个人简介</label>
              <textarea className="input-area" type="text" placeholder=""/>
              <span class="input-mark">必填项</span>
            </div>

            <div className="input-group">
              <label class="input-label">地址</label>
              <input className="input-text" type="text" placeholder="请输入昵称"/>
              <span class="input-mark">必填项</span>
            </div>

            <div className="input-group">
              <label class="input-label">职业</label>
              <input className="input-text" type="text" placeholder="请输入昵称"/>
              <span class="input-mark">必填项</span>
            </div>

            <div className="input-group">
              <label class="input-label">头像</label>
              <div class="two-side">
                  <img src={require('../../../assets/images/avatar.jpg')} className="input-img"/>
                  <div className="input-file-box">
                      <input className="file-input" type="file" placeholder="请输入昵称"/>
                      <button className="file-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                  </div>
              </div>
              <span className="input-mark">必填项</span>
            </div>

            <div className="input-group">
              <input className="input-btn" type="submit" text="确认" />
            </div>
          </div>
        );
    }
}

export default Page;