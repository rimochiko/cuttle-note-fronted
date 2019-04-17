import React, {Component} from 'react';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import {
  Link,
  Switch,
  Route
} from 'react-router-dom';
import Tree from '../../../components/tree';
import Modal from '../../../components/modal';
import DropDown from '../../../components/dropdown'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

import Article from '../article';
import Dashboard from '../dashboard';
import axios from 'axios';

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

const USER = "user",
      GROUP = "group";

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          object: {
            id: '',
            nickname: '',
            avatar: ''
          },
          isAuth: false,
          spaceList: [],
          posts: [],
          post: {
            author: '',
            content: '',
            createDate: '',
            comments: []
          }
        }
        this.getOwnerInfo = this.getOwnerInfo.bind(this);
        this.getPostList = this.getPostList.bind(this);
    }

    async componentWillMount () {
      let userStore = this.props.userStore;
      // 判断是否有登录
      if (await userStore.isLogin() === false) {
        this.props.history.push('/login');
      }
      let user = userStore.user;
      // 先判断URL
      let params = {
        owner:  (this.props.params && this.props.params.owner) || user.userId, 
        obj: (this.props.params && this.props.params.obj) || USER,
        id: (this.props.params && this.props.params.id)
      }

      // 获取用户所拥有的团队
      await userStore.getGroup();
      // 处理GroupList
      let groupList = userStore.groupList && userStore.groupList.map((item) => {
        console.log(item);
        return {
          id: item.id,
          img: item.avatar || require('../../../assets/images/default_g.jpg'),
          text: item.nickname,
          link: `/library/group/{item.id}`  
        }
      })

      // 获取当前空间主人信息
      let owner;
      if (params.owner === 'user.userId') {
        owner = {
          id: user.userId, 
          text: user.nickname,
          avatar: user.avatar || require('../../../assets/images/default.jpg')
        }
      } else {
        // 发送请求获取
        owner = this.getOwnerInfo(params);
      }
      
      // 如果URL的指定不在可访问的空间内
      this.setState({
        object: owner,
        spaceList: [{
          id: user.userId, 
          text: user.nickname,
          avatar: user.avatar || require('../../../assets/images/default.jpg'),
          link: '/library/'
        }].concat(groupList)
      })
      console.log(this.state.object);
    }
    
    /**
     * 获取当前主人的信息
     * @param {*} params 
     */
    getOwnerInfo (params) {
      const query = params.obj === USER ? `
       query {
         data:
         userEasy(
           id=\"${params.owner}\"
         )
       }`:
       `query {
         data:
         groupEasy(
           id=\"${params.owner}\"
         )
       }`;
      await axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        console.log(res.code);
        if(res.code === 1) {
          this.setState({
            object: {
              id: res.id,
              nickname: res.nickname,
              avatar: res.avatar
            }
          })
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
    
    /**
     * 获取空间文章列表
     */
    getPostList () {
      const query = params.obj === USER ? `
      query {
        data:
        userPosts(
          userId=\"${params.owner}\",
          type: 0
        )
      }`:
      `query {
        data:
        groupPosts(
          groupId=\"${params.owner}\",
          type: 0
        )
      }`;
     await axios.post('/graphql', {query})
     .then(({data}) => {
       let res = data.data.data;
       console.log(res.code);
       if(res && res.length >= 0) {
         this.setState({
           posts: res
         })
       }
     })
     .catch((err) => {
       console.log(err);
     })
    }
    
    /** 
     * 删除文章
    */
    showRemovePost () {
      this.refs.remove.toggle()
    }

    /**
     * 文章信息
     */
    showInfoPost (){
      this.refs.info.toggle()
    }

    render () {
        return (
           <div className="page">
                <Sidebar />
                <div className="flex-row overflow flex-1">
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

                    <div className="left flex-column bg-box">
                      <div className="relate">
                        <DropDown data={this.state.spaceList} type="switch">
                          <img src={this.state.object.avatar || require('../../../assets/images/default.jpg')} className="link-img"/>
                          {this.state.object.text}的空间
                          <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                        </DropDown>
                      </div>
                      <div className="tree">
                        <Tree data={this.state.posts} base="/library"/>
                      </div>
                    </div>

                    <div className="flex-scroll-y white">
                      <Switch>
                        <Route path="/article" exact component={Dashboard}/>
                        <Route path="/article(/:obj/:owner/:id)"
                               render={(props) => (
                               <Article
                                  {...props} 
                                  removePost={this.showRemovePost.bind(this)}
                                  infoPost={this.showInfoPost.bind(this)}
                                />)} 
                        />
                      </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;