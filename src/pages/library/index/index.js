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
import Loading from '../../../components/loading';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

import Article from '../article';
import Dashboard from '../dashboard';
import axios from 'axios';
import qlQuery from './graphql';

const USER = "user",
      GROUP = "group";

@inject('userStore', 'postStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          object: {
            id: '',
            nickname: '',
            avatar: '',
            type: USER,
            isFollow: false
          },
          isAuth: false,
          spaceList: [],
          posts: [],
          post: {
            id: '',
            author: '',
            content: '',
            createDate: '',
            comments: []
          },
          isOpted: false
        }
        this.getOwnerInfo = this.getOwnerInfo.bind(this);
        this.getPostList = this.getPostList.bind(this);
        this.generateOption = this.generateOption.bind(this);
    }

    async componentDidMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }
      document.title="文库 - 墨鱼笔记";
      let params = this.analysisParams(this.props);
      await this.getGroup();
      await this.fetchOwnerData(params);
      await this.fetchIdData(params);
      this.refs.loading.toggle();
    }

    async getGroup () {
      let userStore = this.props.userStore;
      let user = userStore.user;

      // 获取用户所拥有的团队
      await userStore.getGroup();
      // 处理GroupList
      let groupList = userStore.groupList && userStore.groupList.map((item) => {
        return {
          id: item.id,
          avatar: item.avatar || require('../../../assets/images/default_g.jpg'),
          text: item.nickname,
          link: `/library/group/${item.id}`,
          type: GROUP 
        }
      })

      this.setState({
        spaceList: [{
          id: user.userId, 
          text: user.nickname,
          avatar: user.avatar || require('../../../assets/images/default.jpg'),
          link: '/library/',
          type: USER
        }].concat(groupList)
      })
    }
    
    /**
     * 获取左侧栏目数据
     */
    async fetchOwnerData (params) {
      let userStore = this.props.userStore;
      let user = userStore.user;

      // 获取当前空间主人信息
      let owner;
      if (params.owner === user.userId) {
        owner = {
          id: user.userId, 
          name: user.nickname,
          avatar: user.avatar || require('../../../assets/images/default.jpg'),
          type: USER
        }
      } else {
        // 发送请求获取
        owner = await this.getOwnerInfo(params, userStore.user.userId);
        owner.type = params.obj
      }
      // 如果URL的指定不在可访问的空间内
      this.setState({
        object: owner
      })

      // 给isAuth赋值
      this.state.spaceList.forEach((item) => {
        if (item.id === owner.id && item.type === owner.type) {
          this.setState({
            isAuth: true
          })
        }
      })

      // 获取文章列表
      this.getPostList(params);
    }

    /**
     * 获取文章
     */
    async fetchIdData (params) {
      if(params.id) {
        const query = qlQuery.getOnePost({
          userId: this.props.userStore.user.userId,
          postId: params.id,
          token: this.props.userStore.user.token 
        });
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if(res.code === 1) {
            // 请求成功
            this.setState({
              post: res.post
            })
          } else {
            console.log("请求文章失败")
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }
    }
    
    /**
     * 获取当前主人的信息
     */
    async getOwnerInfo (params, userId) {
      let owner = {};
      qlQuery.getOwnerInfo(params, userId)
      .then(({data}) => {
        let res = data.data.data;
        let isFollow = data.data.isFollow;
        let avatar;
        if (params.obj === USER) {
          avatar = res.avatar ? `http://localhost:8080/static/user/${res.avatar}`: require('../../../assets/images/default.jpg');
        } else if (params.obj === GROUP) {
          avatar = res.avatar ? `http://localhost:8080/static/group/${res.avatar}`: require('../../../assets/images/default_g.jpg');
        }
        if(res.id) {
          owner = {
            id: res.id,
            name: res.nickname,
            avatar: avatar,
            type: params.obj,
            isFollow: isFollow
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      return owner;
    }
    
    /**
     * 获取空间文章列表
     */
    async getPostList (params) { 
      const query = params.obj === USER ?
      qlQuery.userPostQuery({
         userId: this.props.userStore.user.userId,
         token: this.props.userStore.user.token,
         type: 0,
         author: params.owner        
      }):
      qlQuery.groupPostQuery({
        userId: this.props.userStore.user.userId,
        token: this.props.userStore.user.token,
        type: 0,
        groupId: params.owner  
      });
     await axios.post('/graphql', {query})
     .then(({data}) => {
       let res = data.data.data;
       if(res.code === 1) {
         this.setState({
           posts: res.posts
         })
       } else {
         this.setState({
           isAuth: false
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
    async removePost () {
      const query = this.state.object.type === USER ? 
      qlQuery.userDelPostQuery({
          userId:this.props.userStore.user.userId,
          postId: this.state.post.id,
          token:this.props.userStore.user.token
      })
      : 
      qlQuery.groupDelPostQuery({
        userId:this.props.userStore.user.userId,
        postId: this.state.post.id,
        token:this.props.userStore.user.token,
        groupId:this.state.object.id
      });

      await axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        if(res) {
          // 删除成功
          let match = this.props.match.params;
          this.props.history.push(`library/${match.obj}/`);
        } else {
          // 删除失败
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }

    
    /**
     * 分析路由参数
     */
    analysisParams(props) {
      let match = props.match.params;
      return {
        owner:  match.owner || props.userStore.user.userId, 
        obj: match.obj || USER,
        id: match.id
      }
    }


    async componentWillUpdate(nextProps) {
      let prevMatch = this.props.match.params;
      let nextMatch = nextProps.match.params
      if (prevMatch === nextMatch) {
        return;
      }
      let params = {
        owner:  nextMatch.owner || nextProps.userStore.user.userId, 
        obj: nextMatch.obj || USER,
        id: nextMatch.id
      }
      if (params.obj !== prevMatch.obj) {
        await this.fetchOwnerData(params);
        await this.fetchIdData(params);
      } else if (params.owner !== prevMatch.owner) {
        await this.fetchOwnerData(params);
        await this.fetchIdData(params);
      } else if (params.id !== prevMatch.id) {
        await this.fetchIdData(params);
      }
   }

    /**
     * 文章信息
     */
    showInfoPost (){
      this.refs.info.toggle()
    }

    getDeleteTip () {
      if (this.state.object.type === GROUP) {
        return "删除将会导致其他团队成员无法浏览，确定要执行？";
      }
      if (this.state.post.status === 0) {
        return "草稿文章会被直接删除，确定要执行？"
      }
      return "确定要移入回收站？（15天内可恢复）";
    }

    // 关注用户
    async followUser () {
      if (this.state.object && this.state.object.type === USER && this.state.object.id) {
        await qlQuery.addFollow({
          userId:this.props.userStore.user.userId,
          followId: this.state.object.id,
          token:this.props.userStore.user.token
        })
        .then(({data}) => {
          if (data === 1) {
            this.setState({
              isOpted: true
            })
          }
        })
      }
    }

    // 取消用户
    async unfollowUser () {
      if (this.state.object && this.state.object.type === USER && this.state.object.id) {
        await qlQuery.cancelFollow({
          userId:this.props.userStore.user.userId,
          followId: this.state.object.id,
          token:this.props.userStore.user.token
        })
        .then(({data}) => {
          if (data === 1) {
            this.setState({
              isOpted: false
            })
          }
        })
      }
    }

    /**
     * 生成关注按钮
     */
    generateOption () {
      // 判断是否有写入权
      console.log(this.state.isAuth);
      if (this.state.isAuth) {
        return (
          <Link to="/article/edit" title="创建新文章">
            <FontAwesomeIcon icon="plus" />
          </Link>
        )
      } else if(this.state.object.type === USER){
        if (this.state.object.isFollow) {
          return (
            <div onClick={this.unfollowUser.bind(this)}>
              <FontAwesomeIcon icon="minus"/>取消关注
            </div>
          ) 
        } else {
          return (
            <div onClick={this.followUser.bind(this)}>
              <FontAwesomeIcon icon="plus"/>关注TA
            </div>
          )
        }

      } else if(this.state.object.type === GROUP) {
        return (
          <div>
            <FontAwesomeIcon icon="plus"/>加入团队
          </div>
        )
      }
    }
    render () {
        return (
           <div className="page">
                <Sidebar />
                <div className="flex-row overflow flex-1">
                    <Loading ref="loading"/>
                    <Modal title="文章信息" ref="info">
                      <ul>
                        <li>
                          <p>修改时间</p>
                          <p>修改人</p>
                        </li>
                      </ul>
                    </Modal>
                    <Modal title="删除文章" ref="remove">
                        <div className="normal-modal-inner">
                          <p>{this.getDeleteTip()}</p>
                          <p className="des">*拥有子文档的文档无法直接删除</p>
                          <button className="input-btn radius-btn"
                                  onClick={()=> {
                                    this.refs.remove.toggle()
                                  }}>取消
                          </button>
                          <button className="input-btn radius-btn"
                                  onClick={this.removePost.bind(this)}>确定
                          </button>
                        </div>
                    </Modal>

                    <div className="left flex-column bg-box">
                      <div className="relate">
                        <div className="switch">
                          <DropDown data={this.state.spaceList} type="switch">
                            <img src={this.state.object.avatar || require('../../../assets/images/default.jpg')} className="link-img"/>
                            {this.state.object.name}的空间
                            <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                          </DropDown>                        
                        </div>
                        <div className="option">
                          {
                            this.generateOption()
                          }
                        </div>
                      </div>
                      <div className="tree">
                        <Tree data={this.state.posts} base="library" owner={this.state.object} activeId={this.props.match.params && this.props.match.params.id}/>
                      </div>
                    </div>

                    <div className="flex-scroll-y white">
                      <Switch>
                        <Route path="/library/:obj?/:owner?" exact component={Dashboard}/>
                        <Route path="/library/:obj/:owner/:id"
                          render={(props) => (
                          <Article
                            {...props} 
                            removePost={this.showRemovePost.bind(this)}
                            infoPost={this.showInfoPost.bind(this)}
                            post={this.state.post}
                            isAuth={this.state.isAuth}
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