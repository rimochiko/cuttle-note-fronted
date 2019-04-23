import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';

import Modal from '../../../components/modal';
import DropDown from '../../../components/dropdown'; 
import Switch from '../../../components/switch'; 

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';


import axios from 'axios';
import { inject, observer } from 'mobx-react';
let newsList = [
  {
    id: 3,
    title: '是否要做Code Review？与BAT资深架构...',
    link: '/',
    author: {
      name: '小郑哥',
      avatar: require('../../../assets/images/avatar3.jpg'),
      id: 'rgrg'
    },
    date: '1天前',
    type: 2
  },
  {
    id: 4,
    title: '《深入react技术栈》之样式处理',
    link: '/',
    author: {
      name: '歌非',
      avatar: require('../../../assets/images/avatar6.jpg'),
      id: 'trrtr'
    },
    date: '1天前',
    des: 'css模块化的方案:CSS Module CSS Module样式默认局部,要使用全局样式就加入:...《深入React技术栈》笔记 一、初入React世界 1.2 JSX语法 class 属性修改为...',
    type: 1
  },
  {
    id: 6,
    title: '搜索和在线阅读 Github 代码的插件推荐',
    link: '/',
    author: {
      name: 'sedes',
      avatar: require('../../../assets/images/avatar4.jpg'),
      id: 'sedes'
    },
    date: '1天前',
    isCollected: false,
    type: 2
  },
  {
    id: 7,
    title: '最让程序员自豪的事情是什么？',
    link: '/',
    author: {
      name: '此人已失踪',
      avatar: require('../../../assets/images/avatar5.jpg'),
      id: 'sedes'
    },
    date: '1天前',
    isCollected: false,
    type: 1
  },
  {
    id: 8,
    title: '搜索和在线阅读 Github 代码的插件推荐',
    link: '/',
    author: {
      name: 'sedes',
      avatar: require('../../../assets/images/avatar6.jpg'),
      id: 'sedes'
    },
    date: '1天前',
    isCollected: false,
    type: 1
  }
]

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

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          groupList: [],
          group: {
            name: '',
            des: '',
            id: '',
            avatar: '',
            members: []
          },
          temp: {
            id: '',
            name: '',
            des: '',
            avatar: '',
            public: false
          },
          roleId: 0 
        }
        this.getNewsList = this.getNewsList.bind(this);
    }

    componentWillMount() {
      document.title="团队 - 墨鱼笔记";
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

  getNewsIcon (type) {
    switch(type) {
      case 1: return (
        <span className="icon pen"><FontAwesomeIcon icon="pen" /></span>
      );break;
      case 2: return (
        <span className="icon camera"><FontAwesomeIcon icon="camera" /></span>
      )
    }
  }

  /**
   * 获取动态列表
   *  */
  getNewsList (item) {
    return (
    <div className="item-news" key={item.id}>
      <div className="avatar">                              
        <img src={item.author.avatar}/>
      </div>
      <div className="detail">
        <div className="header">
          <p className="date">{item.date}</p>
          <p className="author"><Link to='/' className="link">{item.author.name}</Link></p>
          <p className="type">
            {this.getNewsIcon(item.type)}
            创建了一篇新的文章<Link to={item.link}>{item.title}</Link>   
          </p>
        </div>
        <div className="body">
          {item.des}
        </div>
      </div>
    </div>
    );
  }
  
  componentDidMount () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('statist-graph'));
    // 绘制图表
    myChart.setOption({
     tooltip : {
       trigger: 'axis',
       axisPointer: {
           type: 'cross',
           label: {
               backgroundColor: '#6a7985'
           }
       }
   },
   legend: {
       data:['浏览量','人气量','记录次数']
   },
   toolbox: {
       feature: {
           saveAsImage: {}
       }
   },
   grid: {
       left: '3%',
       right: '4%',
       bottom: '3%',
       containLabel: true,
       backgroundColor: '#f7f7fb'
   },
   xAxis : [
       {
           type : 'category',
           boundaryGap : false,
           data : ['周一','周二','周三','周四','周五','周六','周日']
       }
   ],
   yAxis : [
       {
           type : 'value'
       }
   ],
   series : [{
           name:'记录次数',
           type:'line',
           smooth: true,
           stack: '总量',
           areaStyle: {color:'#d3d3e7'},
           lineStyle: {color:'#d3d3e7'},
           data:[5, 2, 0, 6, 2, 3, 6]
       },
       {
           name:'浏览量',
           type:'line',
           stack: '总量',
           smooth: true,
           areaStyle: {color: '#ff8ba7'},
           lineStyle: {color:'#ff8ba7'},
           data:[120, 132, 101, 134, 90, 230, 210]
       },
       {
           name:'人气量',
           type:'line',
           smooth: true,
           stack: '总量',
           areaStyle: {color: '#4c71f9'},
           lineStyle: {color: '#4c71f9'},
           data:[54, 18, 61, 34, 90, 30, 10]
       }]
    });
  }

  toggleCreateGroup () {
    this.refs.createGroup.toggle();
  }

   /**
    * 创建一个团队
    */
   createGroup (args) {

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
                          this.state.group.members.map((item) => {
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

                    <Modal title="团队成员" ref="statistics">
                      <div className="member-manage">
                        <table className="member-table">
                          <tr>
                            <th>成员</th>
                            <th>加入日期</th>
                            <th>权限</th>
                            <th></th>
                          </tr>
                            <td>
                              <div className="flex-row flex-align">
                                <img src={require('../../../assets/images/avatar2.jpg')}
                                    className="avatar"/>
                                <div className="info">
                                  <p className="text">测试</p>
                                  <p className="des">test111</p>
                                </div>                              
                              </div>
                            </td>
                            <td>
                              <p>2019-03-11</p>
                            </td>
                            <td><p>管理员</p></td> 
                            <td className="icon">
                               <FontAwesomeIcon icon={["far", "trash-alt"]} />
                            </td>
                        </table>
                      </div>
                    </Modal>

                    <Modal title="创建小组" ref="createGroup">
                      <div className="settings-detail">
                        <div className="flex-row">
                          <div className="flex-column input-side">
                            <div className="input-group">
                              <label className="input-label">小组域名</label>
                              <input className="input-text"
                                     type="text" 
                                     placeholder="请输入域名"
                                     ref="createId"/>
                              <span className="input-mark">必填项</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组名称</label>
                              <input className="input-text" 
                                     type="text" 
                                     placeholder="请输入昵称"
                                     ref="createName"/>
                              <span className="input-mark">必填项</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组简介</label>
                              <textarea className="input-area" 
                                        type="text" 
                                        placeholder="介绍一下你的小组吧！50字以内"
                                        ref="createDes"/>
                              <span className="input-mark">非必填项</span>
                            </div>

                            <div className="input-group mini-group">
                              <div>
                                <label className="input-label">小组是否私密</label>
                                <span className="input-mark">私密小组的图文库只有成员能浏览</span>
                              </div>
                              <Switch 
                                isChecked="this.state.temp.public"
                                onChange={() => {
                                  this.setState({
                                    temp: {
                                      public: !this.state.temp.public
                                    }
                                  })
                                }}/>
                            </div> 
                          </div>

                          <div className="input-group">
                            <label className="input-label">小组头像</label>
                            <div className="two-side">
                              <img src={require('../../../assets/images/default_g.jpg')} className="input-img"/>
                              <div className="input-file-box">
                                  <input className="file-input" 
                                         type="file" 
                                         placeholder="请输入昵称"
                                         onChange={() => {
                                           
                                         }}/>
                                  <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                              </div>
                            </div>
                           <span className="input-mark">非必填项</span>
                          </div>
                        </div>

                        <div className="input-group">
                          <button className="input-btn radius-btn"
                                  onClick={this.createGroup.bind(this)}>确认</button>
                        </div>
                      </div>
                    </Modal>

                    <Modal title="团队设置" ref="setting">
                    <div className="settings-detail">
                        <div className="flex-row">
                          <div className="flex-column input-side">
                            <div className="input-static-group">
                              <label className="input-label">小组域名</label>
                              <div className="input-static">
                                <p className="input-pure-text">{this.state.group.id}</p>
                              </div>
                            </div>
                            <div className="input-group">
                              <label className="input-label">小组名称</label>
                              <input className="input-text"
                                     type="text" 
                                     placeholder="请输入昵称" 
                                     value={this.state.group.name}/>
                              <span className="input-mark">必填项</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组简介</label>
                              <textarea className="input-area" 
                                        type="text" 
                                        placeholder="介绍一下你的小组吧！50字以内" 
                                        value={this.state.group.des}/>
                              <span className="input-mark">非必填项</span>
                            </div>

                            <div className="input-group mini-group">
                              <div>
                                <label className="input-label">小组是否私密</label>
                                <span className="input-mark">私密小组的图文库只有成员能浏览</span>
                              </div>
                              <Switch />
                            </div> 
                          </div>

                          <div className="input-group">
                            <label className="input-label">小组头像</label>
                            <div className="two-side">
                              <img src={require('../../../assets/images/default_g.jpg')} className="input-img"/>
                              <div className="input-file-box">
                                  <input className="file-input" type="file" placeholder="请输入昵称"/>
                                  <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                              </div>
                            </div>
                           <span className="input-mark">非必填项</span>

                           <label className="input-label">其他选项</label>
                           <button className="normal-btn radius-btn">解散小组</button>
                           <span className="input-mark">操作不可逆，小组文库图库都不会保留</span>
                          </div>
                        </div>

                        <div className="input-group">
                           <button className="input-btn radius-btn">确认</button>
                        </div>
                      </div>
                    </Modal>
                  
                  <div className="flex-column  flex-scroll-y">
                    <Header />
                    <div className="group-header">
                      <div className="group-switch">
                        <DropDown data={this.state.groupList}>
                            <img src={require('../../../assets/images/avatar6.jpg')} className="link-img"/>
                            野原家
                            <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                        </DropDown>
                      </div>
                      <div className="group-add" onClick={this.toggleCreateGroup.bind(this)}>
                        创建团队
                      </div>                  
                    </div>

                    
                    <div className="flex-row">
                      <div className="group-box right flex-column">

                          <div className="us-about">
                            <div className="cover">
                              <img src={ this.state.group.avatar || require('../../../assets/images/default_g.jpg')}/>
                            </div>
                            <p className="title">{this.state.group.name}</p>
                            <p className="des">{this.state.group.des || '暂无简介'}</p>
                            <div className="us-list">
                              <ul className="us-people">
                                {
                                  this.state.group.members.map((item) => (
                                    <li key={item.id}>
                                      <img src={item.avatar} alt={item.name}/></li>
                                  ))
                                }
                                <li><span className="btn-add" onClick={this.toggleAddMem.bind(this)}>+</span></li>
                              </ul>
                            </div>
                          </div>

                          <div className="group-links">
                            <h1 className="normal-title">操作通道</h1>
                            <ul className="ul-list-link">
                              <li><Link to={`/library/group/${this.state.group}`}><FontAwesomeIcon icon="book" />文库</Link></li>
                              <li><Link to={`/gallery/group/${this.state.group}`}><FontAwesomeIcon icon="image" />图库</Link></li>
                              <li><span onClick={this.toggleStatistics.bind(this)}><FontAwesomeIcon icon="users" />成员</span></li>
                              <li><span onClick={this.toggleSetting.bind(this)}><FontAwesomeIcon icon="cogs" />设置</span></li>
                            </ul>    
                          </div>   
                      </div>

                      <div className="flex-column group-main">
                        <div className="group-statistics">
                              <div className="section-title">
                                <h1 className="text">数据统计</h1>
                                <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
                              </div>
                              <div className="flex-row">
                                <div className="group-statist-detail">
                                  <div className="item-statist">
                                    <p className="data">123</p>
                                    <p className="name">文章</p>
                                  </div>
                                  <div className="item-statist">
                                    <p className="data">26</p>
                                    <p className="name">文章</p>
                                  </div>
                                  <div className="item-statist">
                                    <p className="data">17</p>
                                    <p className="name">评论</p>
                                  </div>
                                  <div className="item-statist">
                                    <p className="data">1454</p>
                                    <p className="name">浏览</p>
                                  </div>
                                </div>
                                <div className="statist-graph" id="statist-graph"></div>
                              </div>
                          </div>


                          <div className="news">
                            <div className="section-title">
                              <h1 className="text">团队动态</h1>
                              <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
                            </div>
                            {
                              newsList.map((item, index) => {
                                return this.getNewsList(item);
                              })
                            }
                          </div>
                      </div>
                    </div>
                  
                  </div>
                </div>
            </div>
        );
    }
}

export default Page;