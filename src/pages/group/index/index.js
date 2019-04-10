import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Modal from '../../../components/modal';

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

let groupList = [{
  id: '1232',
  name: '野原家',
  count: 3,
  avatar: require('../../../assets/images/avatar5.jpg'),
  news: []
}, {
  id: '1233',
  name: '向日葵班',
  count: 14,
  avatar: require('../../../assets/images/avatar6.jpg'),
  news: []
}];

let groupMember = [{
  id: 'hdbdm', 
  name: '无脸男',
  avatar: require('../../../assets/images/avatar2.jpg')
}, {
  id: 'hdbd3m',
  name: '大神', 
  avatar: require('../../../assets/images/avatar4.jpg')
},
{
  id: 'hdb2dm', 
  name: '山东省',
  avatar: require('../../../assets/images/avatar3.jpg')
},
{
  id: 'hdb4dm', 
  name: '圣斗士',
  avatar: require('../../../assets/images/avatar.jpg')
}]

class Page extends Component {
    constructor () {
        super();
    }
    
    /** 
     * 添加成员面板
    */
    toggleAddMem () {
      this.refs.addMem.toggle();
    }

    /** 
     * 管理团队面板
    */
   toggleSetting () {
     this.refs.setting.toggle();
   }
   
   /**
    * 团队数据统计面板
    */
   toggleStatistics () {
     this.refs.statistics.toggle();
   }

  /**
   * 任务详细面板
   */
  toggleTask () {
    this.refs.task.toggle();
  }

  /**
   * 完成任务
   */
  finishTask () {
    
  }


    render () {
        return (
          <div className="page">
                <Sidebar />
                <div className="flex-row flex-1 overflow">
                    <Modal title="添加成员" ref="addMem">
                      <div className="add-mem">
                        <input type="text" placeholder="搜索ID" className="input"/>
                        <ul className="ul-add-mem">
                        {
                          groupMember.map((item) => {
                            return (
                            <li key={item.id}>
                              <img src={item.avatar} title={item.name}/>
                              <p>{item.name}</p>
                            </li>  
                            )
                          })
                        }
                        </ul>
                        <div className="btns">
                          <button className="radius-btn input-btn">发送邀请</button>  
                        </div>
                      </div>
                    </Modal>


                    <Modal title="团队统计" ref="statistics">
                      
                    </Modal>

                    <Modal title="任务详情" ref="task">
                      <p>标题：完成“React Diff算法分析”</p>
                      <p>说明：暂无说明</p>
                      <p>截至日期：2019-02-12</p>
                      <p>状态：待完成</p>
                      <p>关联文档：</p>  
                    </Modal>

                    <Modal title="团队设置" ref="setting">
                      <div className="settings-detail">
                        <div className="input-group">
                          <label className="input-label">组名</label>
                          <input className="input-text" type="text" placeholder="请输入昵称"/>
                          <span className="input-mark">必填项</span>
                        </div>

                        <div className="input-group">
                          <label className="input-label">小组简介</label>
                          <textarea className="input-area" type="text" placeholder=""/>
                          <span className="input-mark">必填项</span>
                        </div>

                        <div className="input-group">
                          <label className="input-label">小组头像</label>
                          <div className="two-side">
                              <img src={require('../../../assets/images/avatar.jpg')} className="input-img"/>
                              <div className="input-file-box">
                                  <input className="file-input" type="file" placeholder="请输入昵称"/>
                                  <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                              </div>
                          </div>
                          <span className="input-mark">必填项</span>
                        </div>

                        <div className="input-group">
                          <input className="input-btn radius-btn" type="submit" text="确认" />
                        </div>
                      </div>
                    </Modal>


                    <div className="left white">
                      <div className="us">
                        {
                          groupList.map((item) => (
                            <div className="item-us" key={item.id}>
                              <div className="cover-us">
                                <img src={item.avatar} alt={item.name}/>
                              </div>
                              <div className="info-us">
                                <p className="text-main">{item.name}({item.count})</p>
                                <p className="text-sub">{item.news}</p>
                              </div>
                            </div>    
                          ))
                        }    
                      </div>                      
                    </div>

                    <div className="right flex-column">
                      <div className="group-box">
                        <div className="us-about">
                          <div className="cover">
                            <img src={require('../../../assets/images/avatar5.jpg')}/>
                          </div>
                          <p className="title">野原家</p>
                          <p className="des">暂无简介</p>
                          <div className="us-list">
                            <div className="header">
                                <ul className="us-people">
                                {
                                  groupMember.map((item) => (
                                    <li key={item.id}>
                                      <img src={item.avatar} alt={item.name}/></li>
                                  ))
                                }
                                  <li><span className="btn-add" onClick={this.toggleAddMem.bind(this)}>+</span></li>
                                </ul>
                            </div>
                          </div>
                          <p className="des">
                            <Link to="/library"><FontAwesomeIcon icon="book" />文库</Link>
                            <span onClick={this.toggleStatistics.bind(this)}><FontAwesomeIcon icon="database" />统计</span>
                            <span onClick={this.toggleSetting.bind(this)}><FontAwesomeIcon icon="cogs" />设置</span>
                          </p>
                        </div>                      
                      </div>
                      
                      
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;