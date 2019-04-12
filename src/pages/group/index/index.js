import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';

import Modal from '../../../components/modal';
import DropDown from '../../../components/dropdown'; 


import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

let dropdownData = [{
  id: 'gsds',
  text: '野原家的空间',
  link: '/'
},{
  id: 'gsds',
  text: '向日葵班的空间',
  link: '/'
}]

let newsList = [
  {
    id: 3,
    title: '是否要做Code Review？与BAT资深架构...',
    link: '/',
    author: {
      name: '小郑哥',
      avatar: 'https://ww2.sinaimg.cn/bmiddle/005Afflpgy1g1cucjpez6j30j60j675n.jpg',
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
      avatar: 'https://tvax3.sinaimg.cn/crop.0.0.996.996.50/dcedbca1ly8fv8o71kltwj20ro0rot9s.jpg',
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
      avatar: 'https://tva2.sinaimg.cn/crop.48.45.483.483.50/005IMl41jw8evygvu692ij30g40o6402.jpg',
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
      avatar: 'https://tvax1.sinaimg.cn/crop.0.0.996.996.50/006I03Dqly8fzprit6axsj30ro0ro0ua.jpg',
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
      avatar: 'https://tva2.sinaimg.cn/crop.48.45.483.483.50/005IMl41jw8evygvu692ij30g40o6402.jpg',
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

class Page extends Component {
    constructor () {
        super();
        this.getNewsList = this.getNewsList.bind(this);
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
                  
                  <div className="flex-column  flex-scroll-y">
                    <Header />
                    <div className="group-switch">
                      <DropDown data={dropdownData}>
                          <img src={require('../../../assets/images/avatar6.jpg')} className="link-img"/>
                          野原家
                          <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                      </DropDown>
                    </div>
                    
                    <div className="flex-row">
                      <div className="group-box right flex-column">

                          <div className="us-about">
                            <div className="cover">
                              <img src={require('../../../assets/images/avatar6.jpg')}/>
                            </div>
                            <p className="title">野原家</p>
                            <p className="des">暂无简介</p>
                          </div>

                          <div className="group-links">
                            <h1 className="normal-title">操作通道</h1>
                            <ul className="ul-list-link">
                              <li><Link to="/library"><FontAwesomeIcon icon="book" />文库</Link></li>
                              <li><Link to="/library"><FontAwesomeIcon icon="image" />图库</Link></li>
                              <li><span onClick={this.toggleStatistics.bind(this)}><FontAwesomeIcon icon="database" />统计</span></li>
                              <li><span onClick={this.toggleSetting.bind(this)}><FontAwesomeIcon icon="cogs" />设置</span></li>
                            </ul>    
                          </div>   

                          <div className="us-list">
                              <h1 className="normal-title">团队成员(5/10)</h1>
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