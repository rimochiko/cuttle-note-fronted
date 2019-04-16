import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

import axios from 'axios';
import { inject, observer } from 'mobx-react';


let historyList = [
  {
    id: 1,
    title: '嗨，你真的懂this吗？',
    link: '/',
    author: {
      name: '前端小姐姐',
      avatar: 'https://tvax4.sinaimg.cn/crop.0.0.1242.1242.180/005NMivaly8ffc6s0p58bj30yi0yi0un.jpg',
      id: 'ssdfe'
    },
    date: '15分钟前',
    isCollected: false,
    type: 1
  },
  {
    id: 2,
    title: '一个Vue引发的性能问题',
    link: '/',
    author: {
      name: 'heyKid',
      avatar: 'https://tva3.sinaimg.cn/crop.0.0.1242.1242.50/e084652ajw8f2hj7kztoxj20yi0yijsd.jpg',
      id: 'grgrh'
    },
    date: '34分钟前',
    isCollected: false,
    type: 1
  },
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
    isCollected: true,
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
    isCollected: false,
    type: 1
  },
  {
    id: 5,
    title: '9102了，你还不会移动端真机调试？',
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

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.getHistoryList = this.getHistoryList.bind(this);
        this.getNewsList = this.getNewsList.bind(this);
    }

    componentWillMount () {
      // 判断是否有登录
      let user = JSON.parse(window.localStorage.getItem('user'));
      if (user.token) {
        const query = `
        mutation {
          data:
          userVerify(username: \"${user.username}\",token: \"${user.token}\")
        }`;
          
        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          console.log(res);
          if (res === 1) {
            // 验证成功
            this.props.userStore.logIn(user);
          } else {
            this.props.history.push('/login');
          }
        })
        .catch((err) => {
          console.log(err);
        })        
      } else {
        this.props.rootStore.logOut();
        this.props.history.push('/login');
      }
    }

    componentDidMount () {
      // console.log(this.props.userStore);

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

    /** 
     * 获取列表Icon
     * */
    getHistoryIcon (type) {
      switch (type) {
        case 1: return (
          <FontAwesomeIcon icon="file-alt" />
        );break;
        case 2: return (
          <FontAwesomeIcon icon="file-image" />
        );
      }
    }
    /**
     *  获取收藏按钮
     *  */
    getHistoryCollect(isCollected) {
      if (isCollected) {
        return (
          <span className="collect active"><FontAwesomeIcon icon="star"/></span>
        );
      } else {
        return (
          <span className="collect"><FontAwesomeIcon icon={["far","star"]}/></span>
        );
      }
    }
    /** 
     * 获取历史阅读记录
     * */
   getHistoryList (item) {
      return (
        <div className="item-history" key={item.id}>
          <p className="info">{this.getHistoryIcon(item.type)}<Link to={item.link}>{item.title}</Link></p>
          <p className="author"><img src={item.author.avatar}/><Link to="/">{item.author.name}</Link></p>
          <p className="date">{item.date}</p>
          <p className="option">
            {this.getHistoryCollect(item.isCollected)}
          </p>
        </div>
      )
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

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="main flex-column">
                    <Header />
                    <div className="public-body flex-column">    
                      <div className="welcome flex-row">
                        <FontAwesomeIcon icon="calendar-alt" className="icon"></FontAwesomeIcon>
                        <div>
                          <h1>欢迎回来，<span className="name">{this.props.userStore.user.nickname}</span></h1>
                          <p>看看自己的设定任务和团队动态来开始自己的记录吧</p>
                        </div>
                      </div>

                      <div className="panel">
                          <div className="statist">
                            <div className="section-title">
                              <h1 className="text">数据统计</h1>
                              <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
                            </div>
                            <div className="panel">
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

                          <div className="history wrapper">
                            <div className="section-title">
                              <h1 className="text">最近浏览</h1>
                              <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
                            </div>
                            <div className="item-header">
                            </div>
                            {
                              historyList.map((item, index) => {
                                return this.getHistoryList(item);
                              })
                            }
                          </div>
                        </div>

                        <div className="news">
                          <div className="section-title">
                            <h1 className="text">最近动态</h1>
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
        );
    }
}

export default Page;