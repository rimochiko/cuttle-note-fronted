import React, {Component} from 'react';
import Sidebar from '../../../layouts/sidebar/sidebar';
import DropDown from '../../../components/dropdown/';
import Loading from '../../../components/loading/';
import Tooltip from '../../../components/tooltip/';

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Link,
    Switch,
    Route
  } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Chart from '../chart';
import Dashboard from '../dashboard';
import Qlquery from './graphql';
import Modal from '../../../components/modal';

const USER = "user",
      GROUP = "group";

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
            posts: [],
            object: {
                id: '',
                name: '',
                avatar: '',
                type: '',
                isFollow: false
            },
            post: {
                author: '',
                content: '',
                createDate: '',
                comments: []
            },
            spaceList: [],
            draftList: [],
            isAuth: false,
            tipText: ''
        }
        this.generateOption = this.generateOption.bind(this);
    }
    
    async componentDidMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }
      document.title="图库 - 墨鱼笔记";
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
          link: `/gallery/group/${item.id}`  
        }
      })

      this.setState({
        spaceList: [{
          id: user.userId, 
          text: user.nickname,
          avatar: user.avatar || require('../../../assets/images/default.jpg'),
          link: '/gallery/'
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
        if (item.id === owner.id) {
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
          if(res.code === 1) {
            // 请求成功
            this.setState({
              post: res.post
            })
          } else {
            this.showTooltip("请求文章失败:(");
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
    async getOwnerInfo (params,userId) {
      let owner = {};
      await Qlquery.getOwnerInfo(params,userId)
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
      let objs = {
         userId: this.props.userStore.user.userId,
         token: this.props.userStore.user.token,
      }

      if (params.obj === GROUP) {
        objs.groupId = params.owner;
      } else {
        objs.author = params.owner;
      }

     await Qlquery.postListQuery(objs)
     .then(({data}) => {
       let res = data.data.data;
       if(res.code === 1) {
         this.setState({
           posts: res.posts,
           draftList: res.drafts
         })
       } else {
         this.setState({
           isAuth: false,
           posts: [],
           draftList: []
         })
         this.showTooltip('无权访问或该空间不存在:(');
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
        this.showTooltip("电波传达失败:(")
      })
    }

    /**
     * 移除草稿
     */
    async deleteDraft (id) {
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
            console.log(res);
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
      } else {
        Qlquery.deleteAllDraft(params)
        .then(({data}) => {
          let res = data.data.data;
          if(res) {
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
      let nextMatch = nextProps.match.params;
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
  
    toggleCreate () {
      this.refs.create.toggle();
    }

    generateLabel (status) {
      if (status === 0) {
        return (
            <div className="tip-type">
              草稿
            </div>
        )
      }
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
          .catch((err)=> {
            console.log(err);
          })
        }
      }
  
      // 取消用户关注
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
      if (this.state.isAuth) {
        return (
          <div className="option">
            <span title="创建新图画" onClick={this.toggleCreate.bind(this)}>
              <FontAwesomeIcon icon="plus" />
            </span>            
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
      let owner = this.state.object;
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
                          <button className="btn" onClick={this.deleteDraft.bind(this, null)}>舍弃全部草稿</button>
                        </div>
                        <div className="draft-list">
                        {
                          this.state.draftList && this.state.draftList.map((item) => {
                            return (
                              <div className="draft-item" key={item.id}>
                                <Link to={{pathname:'/photo/edit', 
                                           query: {postId: item.id,
                                                  groupId: owner && owner.type === GROUP ? owner.id:null,
                                                  groupName: owner && owner.type === GROUP ? owner.name:null}}} 
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
                    <Modal title="创建新图画" ref="create">
                      <div className="gallery-type-modal">
                        <Link to={{pathname: '/photo/edit/mind',
                                   query: {groupId: owner && owner.type === GROUP ? owner.id:null,
                                           groupName: owner && owner.type === GROUP ? owner.name:null}}} className="gallery-type">
                          <FontAwesomeIcon icon="brain"></FontAwesomeIcon>
                          <p>思维图</p>
                        </Link>
                        <Link to={{pathname: '/photo/edit/flow',
                                   query: {groupId: owner && owner.type === GROUP ? owner.id:null,
                                           groupName: owner && owner.type === GROUP ? owner.name:null}}} className="gallery-type">
                          <FontAwesomeIcon icon="project-diagram"></FontAwesomeIcon>
                          <p>流程图</p>
                        </Link>
                      </div>
                    </Modal>
                    <div className="left flex-column bg-box">
                    <div className="relate">
                        <div className="switch">
                            <DropDown data={this.state.spaceList}>
                            <img src={this.state.object.avatar}
                                 className="link-img"
                                 alt={this.state.object.name}/>
                                {this.state.object.name}的空间
                                <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                            </DropDown>                      
                        </div>
                        {this.generateOption()}
                      </div>                        
                      <div className="imglist">
                        <ul className="component-img-list">
                          {
                              this.state.posts.map((item) => {
                                  return (
                                    <li className="component-img-item" key={item.id}>
                                    {this.generateLabel(item.status)}
                                    <Link to={`/gallery/${this.state.object.type === USER ? USER : GROUP}/${this.state.object.id}/${item.id}`}>
                                      <img src={`http://localhost:8080/static/chart/${item.url}.png`} 
                                            className="component-img-cover"
                                            alt={item.title}/>
                                      <p className="component-img-text">
                                        {item.title}
                                      </p>
                                    </Link>
                                    </li> 
                                  )
                              })
                          }
                          
                        </ul>
                      </div>                      
                    </div>
                    <div className="right flex-scroll-y white">
                    <Switch>
                        <Route path="/gallery/:obj?/:owner?" exact component={Dashboard}/>
                        <Route path="/gallery/:obj/:owner/:id"
                          render={(props) => (
                          <Chart
                            {...props}
                            removePost={this.showRemovePost.bind(this)}
                            infoPost={this.showInfoPost.bind(this)}
                            post={this.state.post}
                            showTooltip={this.showTooltip.bind(this)}
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