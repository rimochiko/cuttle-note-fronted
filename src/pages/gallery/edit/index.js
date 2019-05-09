import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import Loading from '../../../components/loading';
import { 
  Switch,
  Link,
  Route
 } from 'react-router-dom';

import Mind from './Mind';
import Flow from './Flow';
import { inject, observer } from 'mobx-react';

import Qlquery from './graphql';
 
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
          draftTime: null,
          blurTime: null,
          blur: 0,
        }
    }

    async componentWillMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
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
          token: this.props.userStore.user.token 
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
            this.setState({
              title: res.post.title,
              isAuth: res.post.isAuth,
              type: res.content && res.content.type,
              chart: res.content && res.content.chart,
              lastSaveTime: res.post.recentTime,
              lastSaveUser: res.post.recentUser,
              postId: res.post.id,
              space: space
            })
          } else {
            console.log("请求文章失败")
          }
        })
        .catch((err) => {
          console.log(err);
        })
        return;
      }

      // 如果不存在id
      document.title = "新建图画 - 墨鱼笔记";
      
      let space =  query && query.group ? {
          id: query.group.id,
          name: query.group.name,
          type: GROUP          
      } : {
          id: this.props.userStore.user.userId,
          name: this.props.userStore.user.nickname,
          type: USER          
      }
        
      this.setState({
        space: space
      });
    
      if (!match.type || match.type === MIND) {
        this.setState({
          type: MIND,
          chart: {
            roots: [{
              label: '中心主题',
              children: []
            }]
          }
        })
      } else if (match.type === FLOW) {
        this.setState({
          type: FLOW,
          chart: {
            nodes: [],
            edges: []
          }    
        })
      }

    }

    componentDidMount () {

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

      if (state.postId) {
        params.postId = state.postId;
        Qlquery.updateChart(params)
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            this.setState({
              lastSaveTime: res.date
            });
          }
        })
      } else {
        // 创建新图画
        Qlquery.createChart(params)
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            this.setState({
              lastSaveTime: res.date,
              postId: res.postId
            });
          }
        })
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
        imgbase: ''
      };
      // 加入团队信息
      if (state.space.type === GROUP) {
        params.groupId = state.space.id
      }
      if (state.postId) {
        params.postId = state.postId;
        Qlquery.updateChart(params)
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            let url = `/gallery/${state.space.type === USER ? "user" : "group"}/${this.space.id}/${res.postId}`
            this.props.history.push(url);
          }
        })
      } else {
        // 创建新图画
        Qlquery.createChart(params)
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            this.setState({
              lastSaveTime: res.date,
              postId: res.postId
            });
          }
        })
      }
    }
    
    /**
     * 更新图画内容
     * @param {*} data 
     */
    updateChartData (data) {
      this.setState({
        chart: data
      })
    }

    /**
     * 获取图画Base64数据
     */
    getChartBase (data) {
      this.setState({
        imgBase: data
      })
    }


    render () {
        return (
          <div className="flex-row overflow">
            <Sidebar />
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
                  <div className="btns-box">
                    <button className="radius-btn sub-btn" 
                            onClick={this.saveDraft.bind(this)}>保存草稿</button>
                    <button className="radius-btn input-btn"
                            onClick={this.publishPost.bind(this)}>发布</button>
                  </div>
                </div>

                <Switch>
                    <Route path="/photo/edit/" exact  render={(props) => (
                      <Loading />
                    )}/>
                    <Route path="/photo/edit/mind" render={(props) => (
                      <Mind {...props}
                          chart={this.state.chart}
                          update={this.updateChartData.bind(this)}
                          getBase64={this.getChartBase.bind(this)}
                      />
                    )} />
                    <Route path="/photo/edit/flow" render={(props) => (
                      <Flow {...props}
                            chart={this.state.chart}
                            update={this.updateChartData.bind(this)}
                            getBase64={this.getChartBase.bind(this)}
                      />
                    )}/>
                </Switch> 
            </div> 
          </div>
        );
    }
}

export default Page;