import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import Loading from '../../../components/loading';
import Tooltip from '../../../components/tooltip';

import { 
  Switch,
  Link,
  Route
 } from 'react-router-dom';

import Mind from './Mind';
import Flow from './Flow';
import { inject, observer } from 'mobx-react';

import Qlquery from './graphql';
import creatHistory from 'history/createBrowserHistory' 

const history = creatHistory();
const USER = "user",
       GROUP = "group";
const MIND = "mind",
      FLOW = "flow"; 

@inject('userStore', 'postStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          postId: null,
          draftId: null,
          title: null,
          chart: null,
          type: MIND,
          isAuth: false,
          imgBase: null,
          lastSaveTime: '',
          lastSaveUser: {
            id: '',
            name: ''
          },
          space: {
            id: '',
            name: '',
            type: ''
          },
          isUpdate: false,
          changeTimer: null,
          lockTimer: null
        }
        this.generateSaveStatus = this.generateSaveStatus.bind(this);
    }


    async componentDidMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }
      // 判断路由，初始化数据
      let match = this.props.match.params;
      let query = this.props.location.query;
  
      if (query && query.postId) {
        document.title = "编辑图画 - 墨鱼笔记";

        // 获取文档信息
        this.setState({
          postId: this.props.location.query.postId
        })

        // 如果有postId，说明是编辑文档，要先获取文档内容
        await Qlquery.getOnePost({
          userId: this.props.userStore.user.userId,
          postId: this.state.postId,
          token: this.props.userStore.user.token,
          isUpdate: true 
        })
        .then(({data}) => {
          let res = data.data.data;
          if(res.code === 1) {
            // 请求成功
            let space = {
                id: '',
                name: '',
                type: ''            
            };
            let post = res.post;
            if (res.post.belongGroup) {
              space.id = post.belongGroup.id;
              space.name = post.belongGroup.nickname;
              space.type = GROUP
            } else {
              space.id = post.author.id;
              space.name = post.author.nickname;
              space.type = USER;
            }
            let content = res.post.content && JSON.parse(res.post.content);
            this.setState({
              title: res.post.title,
              isAuth: res.post.isAuth,
              type:  content.type,
              chart: content.chart,
              lastSaveTime: res.post.recentTime,
              lastSaveUser: res.post.recentUser,
              space: space,
              isUpdate: true
            })

            // 如果是团队编辑
            if (this.state.space.type === GROUP) {
              this.setState({
                lockTimer: setTimeout(() => {
                    clearInterval(this.state.lockTimer);
                    this.setState({
                      lockTimer: null
                    })
                  this.sendLock();
                }, 15000)
              })
            }
          } else {
            if (res.code === 2) {
              this.showTooltip("文档内容有更新，请重新读取");
            } else if (res.code === 3) {
              this.showTooltip("你的小伙伴正在编辑此文档，请稍后重试");
            } else {
              this.showTooltip("请求文章内容失败");
            }
            setTimeout(() => {
              history.goBack();
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        // 如果不存在id
        document.title = "新建图画 - 墨鱼笔记";
        
        let space;
        if (query && query.groupId) {
          // 获取团队信息
          space =  {
            id: query.groupId,
            name: query.groupName,
            type: GROUP      
          }
        } else {
          space =  {
            id: this.props.userStore.user.userId,
            name: this.props.userStore.user.nickname,
            type: USER       
          }
        }
          
        this.setState({
          space: space
        });
      
        if (!match.type || match.type === MIND) {
          this.setState({
            type: MIND,
            chart: null
          })
        } else if (match.type === FLOW) {
          this.setState({
            type: FLOW,
            chart: null 
          })
        }        
      }
      this.refs.loading.toggle();
    }

    /**
     * 发送加锁信号
     */
    async sendLock () {
      await Qlquery.sendEditStatus({
        userId: this.props.userStore.user.userId,
        postId: this.state.postId,
        token: this.props.userStore.user.token,
        isLock: true 
      })
      .then(({data}) => {
        console.log(data);
        let res = data.data.data;
        console.log('lockres:' + res);
        if (res !== 0) {
          // 保存一份草稿
          this.saveDraft();
          if (res === 1) {
            this.showTooltip("文档内容有更新，请重新读取");
          } else if (res === 2) {
            this.showTooltip("你的小伙伴正在编辑此文档，请稍后重试");
          } else {
            this.showTooltip("请求文章内容失败");
          }
          setTimeout(() => {
            console.log('跳转页面');
            history.goBack();
          }, 1000);          
        }
      })
    }

    componentWillUnmount () {
      clearTimeout(this.state.changeTimer);
      clearTimeout(this.state.lockTimer);
      this.setState({
        lockTimer: null,
        changeTimer: null
      })
    }

    /**
     * 保存草稿
     */
    saveDraft () {
      // 如果已经存在ID
      let state = this.state;
      let params = {
        token: this.props.userStore.user.token,
        userId: this.props.userStore.user.userId,
        title: state.title,
        content: JSON.stringify({
          type: state.type,
          chart: state.chart
        }),
        isAuth: state.isAuth,
        publish: 0,
        imgbase: '',
      };
      // 加入团队信息
      if (state.space.type === GROUP) {
        params.groupId = state.space.id
      }

      this.setState({
        lastSaveTime: '正在保存草稿'
      })

      // 如果是更新文档
      if (state.isUpdate) {
        params.postId = state.postId;
        if (!state.draftId) {
          // 创建新图画
          Qlquery.createChart(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                lastSaveTime: res.date,
                draftId: res.postId
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        } else {
          // 修改post状态
          params.draftId = state.draftId;
          Qlquery.updateChart(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                lastSaveTime: res.date
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      } else {
        // 创建文档
        if (!state.draftId) {
          Qlquery.createChart(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                lastSaveTime: res.date,
                draftId: res.postId
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        } else {
          // 修改post状态
          params.draftId = state.draftId;
          Qlquery.updateChart(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                lastSaveTime: res.date
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      }
    }
    
    /**
     * 发布图片
     */
    publishPost () {
      let state = this.state;
      let params = {
        token: this.props.userStore.user.token,
        userId: this.props.userStore.user.userId,
        title: state.title,
        content: JSON.stringify({
          type: state.type,
          chart: state.chart
        }),
        isAuth: state.isAuth,
        publish: 1,
        imgbase: state.imgBase
      };

      // 加入团队信息
      if (state.space.type === GROUP) {
        params.groupId = state.space.id
      }

      // 如果是发布确认修改的文章
      if (state.isUpdate) {
        params.draftId = state.draftId;
        params.postId = state.postId;
        Qlquery.updateChart(params)
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            let url = `/gallery/${state.space.type === USER ? "user" : "group"}/${state.space.id}/${res.postId}`
            this.props.history.push(url);
          }
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        if (state.draftId) {
          // 修改草稿状态
          params.draftId = this.state.draftId;
          Qlquery.updateChart(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              let url = `/gallery/${state.space.type === USER ? "user" : "group"}/${state.space.id}/${res.postId}`
              this.props.history.push(url);
            }
          })
          .catch((err) => {
            console.log(err);
          })
        } else {
          // 创建新图画
          Qlquery.createChart(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              let url = `/gallery/${state.space.type === USER ? "user" : "group"}/${state.space.id}/${res.postId}`
              this.props.history.push(url);
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      }
    }
    
    /**
     * 更新图画内容
    */
    updateChartData (data) {
      this.setState({
        chart: data
      })
      // 如果数据有变化，10秒保存一次草稿
      if (!this.state.changeTimer) {
        this.setState({
          changeTimer: setTimeout(() => {
            console.log('changeTimer');
            if (!this.refs.mind && !this.refs.flow) {
              clearTimeout(this.state.changeTimer);
              this.setState({
                changeTimer: null
              })
              return;
            }
            this.saveDraft()
          }, 10000)
        })        
      }
    }

    toggleMoreSetting () {
      this.refs.setting.toggle();
    }

    /**
     * 获取图画Base64数据
     */
    getChartBase (data) {
      this.setState({
        imgBase: data
      })
    }
    
    generateSaveStatus () {
      if (this.state.draftId) {
        return (
          <span>
            {this.state.lastSaveUser.nickname} 最后保存于 {this.state.lastSaveTime}（<span className="btn-text" onClick={this.deleteDraft.bind(this)}>舍弃</span>）
          </span>
        )
      } else {
        return (
          <span>
          {this.state.lastSaveUser.nickname} 最后保存于 {this.state.lastSaveTime}
          </span>
        )
      }
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
     * 移除草稿
     */
    deleteDraft () {
      if (this.state.draftId) {
        Qlquery.deleteDraft({
          token: this.props.userStore.user.token,
          userId: this.props.userStore.user.userId,
          draftId: this.state.draftId
        })
        .then(({data}) => {
          let res = data.data.data;
          if (res === 1) {
            // 删除成功
            this.setState({
              draftId: null,
              lastSaveTime: ''
            })
          }
        })
      }
    }

    render () {
        return (
          <div className="flex-row overflow">
            <Sidebar />
            <Loading ref="loading"/>
            <Tooltip ref="tooltip" />
            <Modal title="高级设置" ref="setting">
                <div className="edit-menu">
                  <div className="edit-setting-column">
                    <span className="btn-text">父级文档</span>
                        <input type="text" placeholder="搜索ID" className="input"/>
                        <ul className="ul-add-mem">
                          <li>测试测试</li>
                        </ul>
                    <span className="des">影响权限设置</span>
                  </div>

                  <div className="edit-setting flex-row">
                    <div className="flex-column edit-left">
                      <span className="text">是否私密</span>
                      <span className="des">私密文章无关系者无权查看</span>
                    </div>
                    <Switch />                  
                  </div>
                </div>
            </Modal>
            <div className="flex-column edit-chart-page">
                <div className="chart-edit-header">
                  <input type="text" 
                         placeholder="标题" 
                         className="edit-input"
                         defaultValue={this.state.title}
                         onChange={(e) => {
                           this.setState({
                             title: e.target.value
                           })
                         }}/>
                </div>

                <Switch>
                    <Route path="/photo/edit/" exact  render={(props) => (
                      <Loading />
                    )}/>
                    <Route path="/photo/edit/mind" ref="mind" render={(props) => (
                      <Mind {...props}
                          chart={this.state.chart}
                          update={this.updateChartData.bind(this)}
                          getBase64={this.getChartBase.bind(this)}
                      />
                    )} />
                    <Route path="/photo/edit/flow" ref="flow" render={(props) => (
                      <Flow {...props}
                            chart={this.state.chart}
                            update={this.updateChartData.bind(this)}
                            getBase64={this.getChartBase.bind(this)}
                      />
                    )}/>
                </Switch>
                <div className="edit-footer">
                  <p><span className="label">{this.state.space.type === GROUP ? "团队": "个人"}</span>
                    <Link to={this.state.space.type === "user" ? `/library/user/${this.state.space.id}` : `/library/group/${this.state.space.id}`}>
                    {this.state.space.name}
                    </Link>  / <span className="tip-bold">{this.state.title || '未命名'}</span> <FontAwesomeIcon icon={['far', 'caret-square-down']} className="set-btn" onClick={this.toggleMoreSetting.bind(this)}/>{this.generateSaveStatus()}
                  </p>
                  <div className="btns-box">
                    <button className="radius-btn sub-btn" onClick={()=> {
                      clearTimeout(this.state.changeTimer);
                      this.setState({
                        changeTimer: null
                      })
                      this.saveDraft.apply(this);
                    }}>保存草稿</button>
                    <button className="radius-btn input-btn" onClick={this.publishPost.bind(this)}>发布</button>
                  </div>
                </div> 
            </div> 
          </div>
        );
    }
}

export default Page;