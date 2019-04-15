import React, {Component} from 'react';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import {Link} from 'react-router-dom';
import Tree from '../../../components/tree';
import Modal from '../../../components/modal';
import DropDown from '../../../components/dropdown'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let treeData = [{
  id: 1,
  name: '学习笔记',
  link: '/1',
  isOpen: false,
  child : [{
    id: 11,
    name: 'GraphQL手册',
    link: '/1-1',
    isOpen: false,
    child : [{
      id: 111,
      name: 'GraphQL的诞生',
      link: '/1-1-1',
      isOpen: false,
      child : []
    }]
  }, {
    id: 12,
    name: '计划',
    link: '/1-2',
    isOpen: false,
    child : []
  }]
}, 
{
  id: 2,
  name: '会议记录',
  link: '/2',
  isOpen: false,
  child : [{
    id: 21,
    name: '【2019-04-10】记录',
    link: '/2-1',
    isOpen: false,
    child : [],
    status: 0
  }]
},
{
    id: 3,
    name: '杂杂碎',
    link: '/2',
    isOpen: false,
    child : [{
      id: 21,
      name: '【2019-04-10】记录',
      link: '/2-1',
      isOpen: false,
      child : []
  }]
},
{
  id: 4,
  name: '需求分析',
  link: '/2',
  isOpen: false,
  child : [{
    id: 21,
    name: '【2019-04-10】记录',
    link: '/2-1',
    isOpen: false,
    child : []
}]},
{
    id: 5,
    name: '会议记录11111',
    link: '/2',
    isOpen: false,
    child : [{
      id: 21,
      name: '【2019-04-10】记录',
      link: '/2-1',
      isOpen: false,
      child : []
    }]
  },
  {
      id: 6,
      name: '会议记录11111',
      link: '/2',
      isOpen: false,
      child : [{
        id: 21,
        name: '【2019-04-10】记录',
        link: '/2-1',
        isOpen: false,
        child : []
      }]
},
{
    id: 7,
    name: '会议记录11111',
    link: '/2',
    isOpen: false,
    child : [{
      id: 21,
      name: '【2019-04-10】记录',
      link: '/2-1',
      isOpen: false,
      child : []
    }]
},
{
    id: 8,
    name: '会议记录11111',
    link: '/2',
    isOpen: false,
    child : [{
      id: 21,
      name: '【2019-04-10】记录',
      link: '/2-1',
      isOpen: false,
      child : []
    }]
},
{
    id: 9,
    name: '会议记录11111',
    link: '/2',
    isOpen: false,
    child : [{
      id: 21,
      name: '【2019-04-10】记录',
      link: '/2-1',
      isOpen: false,
      child : []
    }]
},
{
    id: 10,
    name: '会议记录11111',
    link: '/2',
    isOpen: false,
    child : [{
      id: 21,
      name: '【2019-04-10】记录',
      link: '/2-1',
      isOpen: false,
      child : []
    }]
}]

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
    isCollected: false,
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

let postInfo = {
  id: '132',
  author: {
    id: 'seris',
    nickname: 'seris'
  },
  createDate: '2018-12-31',
  lastDate: '2019-02-12',
  lastAuthor: {
    id: 'seris',
    nickname: 'seris'    
  },
  content: '',
  comments: [{
    id: 1,
    from: {
      id: 'dsjds',
      nickname: '九月的风',
      avatar: require('../../../assets/images/avatar1.jpg')
    },  
    to: null,
    content: 'vue2.x采用Object.defineProperty()实现数据劫持，但是并不能劫持到数组长度变化等，是通过创建一个数组的继承类来重写pop()、push()等方法来实现对数组监听的。',
    date: '2018-12-31'
  }, {
    id: 2,
    from: {
      id: 'dsjds',
      nickname: '九月的风',
      avatar: require('../../../assets/images/avatar1.jpg')
    },
    to: {
      id: 'dsjds',
      nickname: '大神',
      avatar: require('../../../assets/images/avatar2.jpg')
    },
    avatar: require('../../../assets/images/avatar2.jpg'),
    content: 'vue2.x采用Object.defineProperty()实现数据劫持，但是并不能劫持到数组长度变化等，是通过创建一个数组的继承类来重写pop()、push()等方法来实现对数组监听的。',
    date: '2018-12-31'
  }] 
}


let dropdownData = [{
  id: 'gsds',
  text: '野原家的空间',
  link: '/'
},{
  id: 'gsds',
  text: '向日葵班的空间',
  link: '/'
}]

class Page extends Component {
    constructor () {
        super();
    }
    
    /** 
     * 删除文章
    */
    removePost () {
      this.refs.remove.toggle()
    }
    
    /** 
     * 展示草稿箱
    */
    showDraft() {
      this.refs.draft.toggle()
    }

    /** 
     * 展示回收站
    */
    showTrash() {
      this.refs.trash.toggle()
    }


        /** 
     * 获取列表Icon
     * */
    getPostIcon (type) {
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
    getPostCollect(isCollected) {
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
     * 获取收藏记录
     * */
   getCollectList (item) {
      return (
        <div className="item-history" key={item.id}>
          <p className="info">{this.getPostIcon(item.type)}<Link to={item.link}>{item.title}</Link></p>
          <p className="author"><img src={item.author.avatar}/><Link to="/">{item.author.name}</Link></p>
          <p className="option">
            {this.getPostCollect(item.isCollected)}
          </p>
        </div>
      )
    }
  
    /** 
     * 获取草稿箱记录
     * */
    getDraftList (item) {
      return (
        <div className="item-history" key={item.id}>
          <p className="info">{this.getPostIcon(item.type)}<Link to={item.link}>{item.title}</Link></p>
          <p className="date">{item.date}</p>
          <p className="option">
            <span>继续编辑</span>
            <span>删除</span>
          </p>
        </div>
        
      )
    }

        /** 
     * 获取回收站记录
     * */
    getTrashList (item) {
      return (
        <div className="item-history" key={item.id}>
          <p className="info">{this.getPostIcon(item.type)}<Link to={item.link}>{item.title}</Link></p>
          <p className="date">{item.date}</p>
          <p className="option">
            <span>恢复</span>
            <span>彻底删除</span>
          </p>
        </div>
      )
    }

    showCollect () {
      this.refs.collect.toggle();
    }

    render () {
        return (
           <div className="page">
                <Sidebar />
                <div className="flex-row overflow flex-1">
                    <Modal title="收藏夹" ref="collect">
                     <div className="modal-collect">
                      {
                        historyList.map((item, index) => {
                          return this.getCollectList(item);
                        })
                      }                     
                     </div>
                    </Modal>
                    <Modal title="草稿箱" ref="draft">
                     <div className="modal-collect">
                      {
                        historyList.map((item, index) => {
                          return this.getDraftList(item);
                        })
                      }                     
                     </div>
                    </Modal>
                    <Modal title="回收站" ref="trash">
                     <div className="modal-collect">
                      {
                        historyList.map((item, index) => {
                          return this.getTrashList(item);
                        })
                      }                     
                     </div>
                    </Modal>
                    <div className="left flex-column bg-box">
                      <div className="relate">
                        <DropDown data={dropdownData}>
                          <img src={require('../../../assets/images/avatar.jpg')} className="link-img"/>我的空间
                                <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                        </DropDown>
                      </div>
                      <div className="tree">
                        <Tree data={treeData} base="/library"/>
                      </div>                 

                    </div>

                    <div className="flex-scroll-y white">
                      <Modal title="文章信息" ref="info">
                        <ul>
                          <li>
                            <p>修改时间</p>
                            <p>修改人</p>
                          </li>
                        </ul>
                      </Modal>
                      <Modal title="删除文章" ref="remove">
                         <p>你真的要删除该文章？</p>
                         <button className="input-btn">取消</button>
                         <button className="input-btn">确定</button>
                      </Modal>
                      <div className="article">
                          <div className="header">
                            <h1 className="title">我如何零基础转行成为一个自信的前端</h1>
                            <div className="detail">
                              <p>
                                <span>创建人：<Link to="/">Seris</Link></span>
                                <span>创建日期：2019-03-19</span>
                              </p>
                              <p>
                                <span title="文章信息"><FontAwesomeIcon icon="info-circle"/></span>
                                <Link title="编辑" to="/article/edit"><FontAwesomeIcon icon="pen"/></Link>
                                <span title="删除" onClick={this.removePost.bind(this)}><FontAwesomeIcon icon="trash-alt"/></span>
                              </p>
                            </div>
                          </div>
                          <div className="body">
                            <div className="content">
                              
                            </div>
                            <div className="extra">
                              <ul className="extra-ul">
                                <li><FontAwesomeIcon icon={["far","eye"]}></FontAwesomeIcon> 11</li>
                                <li><FontAwesomeIcon icon={["far","thumbs-up"]}></FontAwesomeIcon> 0</li>
                              </ul>
                              <ul className="extra-ul">
                                <li><FontAwesomeIcon icon={["far", "star"]}></FontAwesomeIcon> 收藏</li>
                                <li><FontAwesomeIcon icon="share-alt"></FontAwesomeIcon> 分享</li>
                              </ul>
                            </div>
                          </div>
                          

                          <div className="comments">
                            <h1 className="section-title">我要评论</h1>
                            <div className="input-comment-box">
                              <textarea className="input-textarea"></textarea>
                              <div className="input-btn-box">
                                <input type="submit" text="提交" className="input-btn radius-btn"/>
                              </div>
                            </div>

                            <div className="list-comment-box">
                              <h1 className="section-title">全部评论（{postInfo.comments.length}）</h1>
                              <ul className="ul-comment-single">
                                {
                                  postInfo.comments.map((item) => {
                                    if (item.to) {
                                      return (
                                        <li className="li-comment-single" key={item.id}>
                                          <img src={item.from.avatar} />
                                          <div className="author-comment">
                                            <Link to="/">{item.from.nickname}</Link> 回复 <Link to="/">{item.to.nickname}</Link>：
                                            {item.content}
                                            <span className="date"> {item.date}</span>
                                          </div>
                                          <span className="btn-reply">回复</span>
                                        </li>                                      
                                      )
                                    } else {
                                      return (
                                        <li className="li-comment-single" key={item.id}>
                                          <img src={item.from.avatar} />
                                          <div className="author-comment">
                                            <Link to="/">{item.from.nickname}</Link>：
                                            {item.content}
                                            <span className="date"> {item.date}</span>
                                          </div>
                                          <span className="btn-reply">回复</span>
                                        </li>        
                                      )
                                    }
                                  })
                                }
                              </ul>
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