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
import axios from 'axios';
import Qlquery from './graphql';

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
          draftList: [],
          tipText: ''
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
        const query = Qlquery.getOnePost({
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
            this.showTooltip("请求文章失败");
          }
        })
        .catch((err) => {
          this.showTooltip(err);
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
        this.showTooltip(err);
      })
      return owner;
    }

    showTooltip (text) {
      this.setState({
        tipText: text
      });
      this.refs.tooltip.show();
    }
    
    /**
     * 获取空间文章列表
     */
    async getPostList (params) { 
      const query = params.obj === USER ?
      Qlquery.userPostQuery({
         userId: this.props.userStore.user.userId,
         token: this.props.userStore.user.token,
         type: 0,
         author: params.owner        
      }):
      Qlquery.groupPostQuery({
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
           posts: res.posts,
           draftList: res.drafts
         })
       } else {
         this.setState({
           posts: [],
           draftList: []
         })
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
      const query = this.state.object.type === USER ? 
      Qlquery.userDelPostQuery({
          userId:this.props.userStore.user.userId,
          postId: this.state.post.id,
          token:this.props.userStore.user.token
      })
      : 
      Qlquery.groupDelPostQuery({
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
          this.showRemovePost();
          this.showTooltip("文章已放入回收站:)")
          this.props.history.push(`/library/${match.obj}/`);
        } else {
          // 删除失败
          this.showTooltip("电波传达失败:(")
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
    /**
     * 移除草稿
     * @param {} props 
     */
    async deleteDraft (id) {
      const query = this.state.object.type === USER ? 
      Qlquery.userDelPostQuery({
          userId:this.props.userStore.user.userId,
          postId: id,
          token:this.props.userStore.user.token
      })
      : 
      Qlquery.groupDelPostQuery({
        userId:this.props.userStore.user.userId,
        postId: id,
        token:this.props.userStore.user.token,
        groupId:this.state.object.id
      });

      await axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        if(res) {
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
      this.refs.loading.toggle();
      if (params.obj !== prevMatch.obj) {
        await this.fetchOwnerData(params);
        await this.fetchIdData(params);
      } else if (params.owner !== prevMatch.owner) {
        await this.fetchOwnerData(params);
        await this.fetchIdData(params);
      } else if (params.id !== prevMatch.id) {
        await this.fetchIdData(params);
      }
      this.refs.loading.toggle();
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
          if (res === 1) {
            let object = Object.assign({}, this.state.object, {isFollow: true})
            this.setState({
              object: object
            })
            this.showTooltip("关注用户成功:)");
          } else {
            this.showTooltip("关注用户失败:(");
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
          if (res === 1) {
            let object = Object.assign({}, this.state.object, {isFollow: false})
            this.setState({
              object: object
            })
            this.showTooltip("取消关注成功:)");
          } else {
            this.showTooltip("取消关注失败:)");
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
                    <Modal title="草稿箱" ref="draft">
                      <div className="draft-box">
                        <div className="draft-header">
                          <span className="title">{(this.state.object && this.state.object.nickname) || '我'}的草稿箱</span>
                          <button className="btn">舍弃全部草稿</button>
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
                                    <Link to={`library/${this.state.object.type}/${this.state.object.id}`} className="link">{item.author}</Link>
                                     保存于{item.date} · <span className="link" onClick={this.deleteDraft.bind(this, item.id)}>舍弃</span>
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