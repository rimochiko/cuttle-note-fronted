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


let TrashList = [
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

class Page extends Component {
    constructor () {
        super();
        this.getTrashList = this.getTrashList.bind(this);
    }

    componentDidMount () {
     
    }

    /** 
     * 获取列表Icon
     * */
    getTrashIcon (type) {
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
     * 获取回收站记录
     * */
   getTrashList (item) {
      return (
        <div className="item-trash" key={item.id}>
          <p className="info">{this.getTrashIcon(item.type)}<Link to={item.link}>{item.title}</Link></p>
          <p className="date">{item.date}</p>
          <p className="option">
            <button className="input-btn radius-btn">恢复</button>
            <button className="sub-btn radius-btn">彻底删除</button>
          </p>
        </div>
      )
    }

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="main flex-column">
                    <Header />
                    <div className="public-body flex-column">    

                          <div className="trash-box wrapper">
                              <h1 className="normal-title">我的回收站</h1>
                              <div className="item-list">
                              {
                                TrashList.map((item, index) => {
                                  return this.getTrashList(item);
                                })
                              }
                              </div>
                          </div>
                      
                   </div>
                </div>
            </div>
        );
    }
}

export default Page;