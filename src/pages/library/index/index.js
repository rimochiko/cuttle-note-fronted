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
import Tooltip from '../../../components/tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

import Article from '../article';
import Dashboard from '../dashboard';
import Qlquery from './graphql';

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
          draftList: [],
          tipText: ''
        }
        this.getOwnerInfo = this.getOwnerInfo.bind(this);
        this.getPostList = this.getPostList.bind(this);
        this.generateOption = this.generateOption.bind(this);
        this.tooltip = null;
    }

    isUrlExist (params) {
      if ((params.obj !== USER) && (params.obj !== GROUP)) {
        return false;
      }
      if (params.id && !(/^[0-9]+$/.test(params.id))) {
        return false;
      }
      return true;
    }
    async componentDidMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }
      document.title="文库 - 墨鱼笔记";
      let params = this.analysisParams(this.props);
      if (!this.isUrlExist(params)) {
        this.props.history.push('/404');
        return;
      }
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
        await Qlquery.getOnePost({
          userId: this.props.userStore.user.userId,
          postId: params.id,
          token: this.props.userStore.user.token
        })
        .then(({data}) => {
          let res = data.data.data;
          if(res.code === 0) {
            // 请求成功
            let post = res.result;
            post.title = unescape(post.title);
            post.content = unescape(post.content);
            this.setState({
              post
            })
          } else {
            if (res.code === 8) {
              this.props.history.push('/404');
              return;
            }
            this.showTooltip(res.msg || "请求文章失败");
          }
        })
        .catch((err) => {
          console.log(err);
          this.showTooltip("请求文章失败");
        })
      }
    }
    
    /**
     * 获取当前主人的信息
     */
    async getOwnerInfo (params, userId) {
      let owner = {};
      await Qlquery.getOwnerInfo(params, userId)
      .then(({data}) => {
        let obj = data.data.data,
            res = obj.result;
        let isFollow = data.data.isFollow;
        let avatar;
        if(obj.code === 0) {
          if (params.obj === USER) {
            avatar = res.avatar ? `http://localhost:8080/static/user/${res.avatar}`: require('../../../assets/images/default.jpg');
          } else if (params.obj === GROUP) {
            avatar = res.avatar ? `http://localhost:8080/static/group/${res.avatar}`: require('../../../assets/images/default_g.jpg');
          }
          owner = {
            id: res.id,
            name: res.nickname,
            avatar: avatar,
            type: params.obj,
            isFollow: isFollow && isFollow.result
          }
        } else {
          if (obj.code === 8) {
            this.props.history.push('/404');
            return;
          }
          this.showTooltip(obj.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        this.showTooltip("电波传达错误:(");
      })
      return owner;
    }

    showTooltip (text) {
      if (this.refs.tooltip) {
        this.setState({
          tipText: text
        });
        this.refs.tooltip.show();        
      }
    }
    
    /**
     * 获取空间文章列表
     */
    async getPostList (params) { 
      let objs = {
        userId: this.props.userStore.user.userId,
        token: this.props.userStore.user.token,
        isFind: this.state.isAuth
     }

     if (params.obj === GROUP) {
       objs.groupId = params.owner;
     } else {
       objs.author = params.owner;
     }
      await Qlquery.postListQuery(objs)
      .then(({data}) => {
        let posts = data.data.posts,
            drafts = data.data.drafts;
        if(posts.code === 0) {
          this.setState({
            posts: posts.result || [],
            draftList: drafts.result || []
          })
        } else {
          this.setState({
            posts: [],
            draftList: []
          })
          if (posts.code === 4) {
            this.refs.auth.toggle();
            return;
          }
          if (posts.code === 8) {
            this.props.history.push('/404');
            return;
          }
          this.showTooltip(posts.msg || '无权访问或该空间不存在:(');
        }
      })
      .catch((err) => {
        console.log(err);
        this.showTooltip("电波传达失败:(")
      })
    }
    
    /** 
     * 删除文章
    */
    showRemovePost () {
      this.refs.remove.toggle()
    }
    async removePost () {
      let params = {
        userId:this.props.userStore.user.userId,
        postId: this.state.post.id,
        token:this.props.userStore.user.token        
      }
      if (this.state.object.type === GROUP) {
        params.groupId = this.state.object.id;
      }
      await Qlquery.deletePost(params)
      .then(async ({data}) => {
        let res = data.data.data;
        if(res.code === 0) {
          // 删除成功
          let match = this.props.match.params;
          this.showRemovePost();
          this.showTooltip("文章已放入回收站:)")
          await this.fetchOwnerData(match);
          this.props.history.push(`/library/${match.obj}/`);
        } else {
          // 删除失败
          this.showTooltip(res.msg || "电波传达失败:(")
        }
      })
      .catch((err) => {
        console.log(err);
        this.showTooltip("电波传达失败:(");
      })
    }

    /**
     * 移除草稿
     */
    async deleteDraft (id = null) {
      let params = {
        userId:this.props.userStore.user.userId,
        token:this.props.userStore.user.token
      }
      if (this.state.object.type === GROUP) {
        params.groupId = this.state.object.id;
      }
      if (id) {
          params.postId = id;
          Qlquery.deletePost(params)
          .then(({data}) => {
            let res = data.data.data;
            if(res.code === 0) {
              // 删除成功
              this.showTooltip("草稿已移除:)")
              let index;
              this.state.draftList && this.state.draftList.forEach((item, index1) => {
                if (item.id === id) {
                  index = index1;
                }
              });
              let draft = this.state.draftList.slice();
              draft.splice(index, 1);
              this.setState({
                draftList: draft
              }) 
            } else {
              // 删除失败
              this.showTooltip("电波传达失败:(")
            }
          })
          .catch((err) => {
            console.log(err);
          })        
      } else {
        Qlquery.deleteAllDraft(params)
        .then(({data}) => {
          let res = data.data.data;
          if(res.code === 0) {
            // 删除成功
            this.showTooltip("草稿已全部移除:)")
            this.setState({
              draftList: []
            }) 
          } else {
            // 删除失败
            this.showTooltip("电波传达失败:(")
          }
        })
        .catch((err) => {
          console.log(err);
        })   
      }
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
      if (!this.isUrlExist(params)) {
        this.props.history.push('/404');
        return;
      }
      this.refs.auth.toggle(false);
      this.refs.loading.toggle(true);
      if (params.obj !== prevMatch.obj) {
        await this.fetchOwnerData(params);
        await this.fetchIdData(params);
      } else if (params.owner !== prevMatch.owner) {
        await this.fetchOwnerData(params);
        await this.fetchIdData(params);
      } else if (params.id !== prevMatch.id) {
        await this.fetchIdData(params);
      }
      this.refs.loading.toggle(false);
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
        await Qlquery.addFollow({
          userId:this.props.userStore.user.userId,
          followId: this.state.object.id,
          token:this.props.userStore.user.token
        })
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 0) {
            let object = Object.assign({}, this.state.object, {isFollow: true})
            this.setState({
              object: object
            })
            this.showTooltip("关注用户成功:)");
          } else {
            this.showTooltip(res.msg);
          }
        })
      }
    }

    // 取消用户
    async unfollowUser () {
      if (this.state.object && this.state.object.type === USER && this.state.object.id) {
        await Qlquery.cancelFollow({
          userId:this.props.userStore.user.userId,
          followId: this.state.object.id,
          token:this.props.userStore.user.token
        })
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 0) {
            let object = Object.assign({}, this.state.object, {isFollow: false})
            this.setState({
              object: object
            })
            this.showTooltip("取消关注成功:)");
          } else {
            this.showTooltip(res.msg);
          }
        })
      }
    }

    toggleDraft () {
      this.refs.draft.toggle();
    }

    /**
     * 生成关注按钮
     */
    generateOption () {
      // 判断是否有写入权
      let owner = this.state.object;
      if (this.state.isAuth) {
        return (
          <div className="option">
            <Link to={{pathname: '/article/edit',
                       query: {groupId: owner && owner.type === GROUP ? owner.id:null,
                               groupName: owner && owner.type === GROUP ? owner.name:null}}} title="创建新文章">
              <FontAwesomeIcon icon="plus" />
            </Link>
            <span title="草稿箱" onClick={this.toggleDraft.bind(this)}>
              <FontAwesomeIcon icon="box" />
            </span>            
          </div>
        )
      } else if(this.state.object.type === USER){
        if (this.state.object.isFollow) {
          return (
            <div className="option">
              <div onClick={this.unfollowUser.bind(this)}>
                <FontAwesomeIcon icon="minus"/>取消关注
              </div>              
            </div>
          ) 
        } else {
          return (
            <div className="option">
              <div onClick={this.followUser.bind(this)}>
                <FontAwesomeIcon icon="plus"/>关注TA
              </div>              
            </div>
          )
        }

      } else if(this.state.object.type === GROUP) {
        return (
          <div className="option">
            <div>
              <FontAwesomeIcon icon="plus"/>加入团队
            </div>
          </div>
        )
      }
      return (
        <div className="option"></div>
      )
    }
    render () {
        return (
           <div className="page">
                <Sidebar />
                <div className="flex-row overflow flex-1">
                    <Loading ref="loading"/>
                    <Tooltip ref="tooltip" text={this.state.tipText}/>
                    <Modal title="访问提示" ref="auth" auth="1">
                      <div className="auth-box">
                        <div className="auth-header">
                          <p className="title">Oh，你没有访问此页面的权限哦！</p>
                          <p className="des">你可以联系该页面的管理员~</p>                        
                        </div>
                        <div className="auth-list">
                            <div className="auth-item">
                              <img src={require('../../../assets/images/default.jpg')} alt=""/>
                              <p className="title">111111</p> 
                              <p className="des">ID：111111</p> 
                            </div>  
                        </div>
                      </div>
                    </Modal>
                    <Modal title="草稿箱" ref="draft">
                      <div className="draft-box">
                        <div className="draft-header">
                          <span className="title">我的草稿箱</span>
                          <button className="btn" onClick={this.deleteDraft.bind(this,null)}>舍弃全部草稿</button>
                        </div>
                        <div className="draft-list">
                          {
                            this.state.draftList && this.state.draftList.map((item) => {
                              return (
                                <div className="draft-item" key={item.id}>
                                  <Link to={{pathname:'/article/edit', 
                                            query: {postId: item.id,
                                                    parentId: item.parentId}}} 
                                        className="title">{item.title}</Link>
                                  <p className="des">
                                     我保存于{item.recentTime} · <span className="link" onClick={this.deleteDraft.bind(this, item.id)}>舍弃</span>
                                  </p>
                                </div>  
                              )
                            })
                          }
                        </div>
                      </div>
                    </Modal>
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
                            <img src={this.state.object.avatar || require('../../../assets/images/default.jpg')}
                                 className="link-img"
                                 alt=""/>
                            {this.state.object.name}的空间
                            <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                          </DropDown>                        
                        </div>
                        {
                          this.generateOption()
                        }
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
                            showTooltip={this.showTooltip.bind(this)}
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