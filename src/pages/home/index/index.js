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

import { inject, observer } from 'mobx-react';

import Qlquery from './graphql';
import Loading from '../../../components/loading';

const FILE_CREATE = 5;

const GROUP = "group",
      USER = "user",
      ARTICLE = "library",
      CHART = "gallery";

const defaultStatistic = {
            likeNum: 0,
            textNum: 0,
            viewNum: 0,
            imgNum: 0,
            chart: [{"name":"记录次数",
            "type":"line",
            "smooth":true,
            "stack":"总量",
            "areaStyle":{"color":"#d3d3e7"},
            "lineStyle":{"color":"#d3d3e7"},
            "data":[0,0,0,0,0,0,0]}]  
}

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          recentViews: [],
          news: [],
          statistic:defaultStatistic
        }
        this.getHistoryList = this.getHistoryList.bind(this);
        this.getNewsList = this.getNewsList.bind(this);
    }

    async fetchData () {
      // 获取最近浏览文章
      let userStore = this.props.userStore;
      await Qlquery.getHomeData({
        token: userStore.user.token,
        userId: userStore.user.userId
      })
      .then(({data}) => {
          let recent = data.data.recent,
              news = data.data.news,
              statistic = data.data.statistic;
          statistic.charts =  statistic && statistic.charts && statistic.charts.map(item => JSON.parse(item))
          this.generatePostLink(recent && recent.posts);
          this.setState({
            recentViews: recent && recent.code === 1 ? recent.posts : [],
            news: news && news.code === 1 ? news.options: [],
            statistic: statistic || defaultStatistic
          })             
      })
    }

    generatePostLink (list) {
      list && list.forEach((item) => {
        let owner = item.group && item.group.id ? GROUP : USER,
            type = item.type === 0 ? ARTICLE : CHART,
            author = item.group && item.group.id ? item.group.id : item.author.id;
        item.link = `/${type}/${owner}/${author}/${item.id}`;
      })

    }

    async componentDidMount () {
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }
      document.title="我的首页 - 墨鱼笔记";

      await this.fetchData();

      this.refs.loading.toggle();
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
              data : (this.state.statistic && this.state.statistic.dates) || ['','','','','','','']
          }
      ],
      yAxis : [{
              type : 'value'
      }],
      series : (this.state.statistic && this.state.statistic.charts) || defaultStatistic.chart
       });
    }

    /** 
     * 获取列表Icon
     * */
    getHistoryIcon (type) {
      switch (type) {
        case 0: return (
          <FontAwesomeIcon icon="file-alt" />
        );
        case 1: return (
          <FontAwesomeIcon icon="file-image" />
        );
        default: return '';
      }
    }

    /** 
     * 获取历史阅读记录
     * */
   getHistoryList (item) {
      return (
        <div className="item-history" key={item.id}>
          <p className="info">{this.getHistoryIcon(item.type)}<Link to={item.link}>{item.title}</Link></p>
          <p className="author">
            <img src={item.author.avatar ? `http://localhost:8080/static/user/${item.author.avatar}` : require('../../../assets/images/default.jpg')} alt=""/><Link to="/">{item.author.nickname}</Link></p>
          <p className="date">{item.date}</p>
          <p className="option">
              {item.group && item.group.id ? `${item.group.nickname}的空间` : `${item.author.nickname}的空间`}
          </p>
        </div>
      )
    }

    getNewsIcon (type) {
      switch(type) {
        case 0: return (
          <span className="icon pen"><FontAwesomeIcon icon="pen" /></span>
        );
        case 1: return (
          <span className="icon camera"><FontAwesomeIcon icon="camera" /></span>
        );
        default: return '';
      }
    }

    /**
     * 获取动态列表
     *  */
    getNewsList (item) {
      // 根据动态种类
      switch(item.type) {
        case FILE_CREATE:
          return (
            <div className="item-news" key={item.id}>
              <div className="avatar">                              
                <img src={item.user.avatar ? `http://localhost:8080/static/user/${item.user.avatar}` : require('../../../assets/images/default.jpg')} 
                     alt={item.user.id}/>
              </div>
              <div className="detail">
                <div className="header">
                  <p className="date">{item.date}</p>
                  <p className="author"><Link to='/' className="link">{item.user.nickname}</Link></p>
                  <p className="type">
                    {this.getNewsIcon(item.post.type)}
                    {item.post.type === 0 ? "创建了一篇新文章 " : "创建了一张新图画 "}
                    <Link to={item.post.type === 0 ? `/library/${item.post.link}`:`/gallery/${item.post.link}`}>{item.post.title}</Link>   
                  </p>
                </div>
                <div className="body">
                  {item.post.type === 0 ? item.post.content : "" } 
                </div>
              </div>
            </div>
          );
        default: return '';
      }
      
    }

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="main flex-column">
                    <Loading ref="loading" />
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
                                <p className="data">{this.state.statistic.textNum}</p>
                                <p className="name">文章</p>
                              </div>
                              <div className="item-statist">
                                <p className="data">{this.state.statistic.imgNum}</p>
                                <p className="name">图画</p>
                              </div>
                              <div className="item-statist">
                                <p className="data">{this.state.statistic.viewNum}</p>
                                <p className="name">浏览量</p>
                              </div>
                              <div className="item-statist">
                                <p className="data">{this.state.statistic.likeNum}</p>
                                <p className="name">点赞量</p>
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
                              this.state.recentViews && this.state.recentViews.map((item, index) => {
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
                            this.state.news && this.state.news.map((item, index) => {
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