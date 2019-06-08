import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import Loading from '../../../components/loading';
import Tooltip from '../../../components/tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { inject, observer } from 'mobx-react';
import axios from 'axios';

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          posts: [],
          tipText: ''
        }
        this.getTrashList = this.getTrashList.bind(this);
        this.generateTrash = this.generateTrash.bind(this);
    }

    async componentDidMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }
      await this.getTrashData();
      this.refs.loading.toggle();
    }

    /**
     * 获取回收站数据
     */
    getTrashData () {
      const query = `
        query {
          data:
          trashPosts(
            userId: "${this.props.userStore.user.userId}",
            token: "${this.props.userStore.user.token}"
          ) {
            code,
            msg,
            result {
              id
              title
              recentTime
            }
          }
        }
      `;
      axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        if(res.code === 0) {
          this.setState({
            posts: res.result
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }

    showTooltip (text) {
      this.setState({
        tipText: text
      });
      this.refs.tooltip.show()
    }
  
      /**
     * 清空回收站
     */
    removeAllPost () {
      const query = `
      mutation {
        data:
        postAllRemove(
            userId: "${this.props.userStore.user.userId}",
            token: "${this.props.userStore.user.token}"
            isDraft: 0
        ) {
          code,
          msg
        }
      }
      `;
      axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        if(res.code === 0) {
          this.setState({
            posts: []
          });
        } else {
          this.showTooltip(res.msg || "清空文档失败")
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }


    /** 
     * 获取列表Icon
     * */
    getTrashIcon (type) {
      switch (type) {
        case 1: return (
          <FontAwesomeIcon icon="file-alt" />
        );
        case 2: return (
          <FontAwesomeIcon icon="file-image" />
        );
        default: ;
      }
    }

    /** 
     * 获取回收站记录
     * */
   getTrashList (item) {
      return (
        <div className="item-trash" key={item.id}>
          <p className="info">{this.getTrashIcon(item.type)}{item.title}</p>
          <p className="date">{item.date}</p>
          <p className="option">
            <button className="input-btn radius-btn" onClick={this.recoverPost.bind(this, item.id)}>恢复</button>
            <button className="sub-btn radius-btn" onClick={this.completeRemove.bind(this, item.id)}>彻底删除</button>
          </p>
        </div>
      )
    }

    /**
     * 恢复草稿
     */
    recoverPost (id) {
      const query = `
        mutation {
          data:
          postRecover(
            userId: "${this.props.userStore.user.userId}",
            token: "${this.props.userStore.user.token}",
            postId: ${id}
          ) {
            code,
            msg
          }
        }
      `;
      axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        if(res.code === 0) {
          // 恢复删除文章
          let index;
          this.state.posts && this.state.posts.forEach((item, index1) => {
            if (item.id === id) {
              index = index1;
            }
          });
          let posts = this.state.posts.slice(0);
          posts.splice(index, 1);
          this.setState({
            posts
          })
          this.showTooltip("成功恢复文档")
        } else {
          this.showTooltip(res.msg || '恢复文档失败:(')
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }

    /**
     * 完全删除
     */
    completeRemove (id) {
      const query = `
        mutation {
          data:
          postDelete(
            userId: "${this.props.userStore.user.userId}",
            token: "${this.props.userStore.user.token}",
            postId: ${id},
            absolute: 1
          ) {
            code,
            msg
          }
        }
      `;
      axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        if(res.code === 0) {
          let index;
          this.state.posts && this.state.posts.forEach((item, index1) => {
            if (item.id === id) {
              index = index1;
            }
          });
          let posts = this.state.posts.slice(0);
          posts.splice(index, 1);
          this.setState({
            posts
          })
          this.showTooltip("文档已彻底清除")
        } else {
          this.showTooltip(res.msg || "文档彻底清除失败:(")
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
    generateTrash () {
      if (this.state.posts && this.state.posts.length) {
        return  this.state.posts.map((item, index) => {
          return this.getTrashList(item);
        });
      } else {
        return (
          <div className="other-no-tip">
            <p className="title">你的回收站中没有任何文章！</p>
            <p className="des">草稿不会收录在回收站中哦~</p>
          </div>
        )
      }
    }

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="main flex-column">
                    <Loading ref="loading" />
                    <Tooltip ref="tooltip" text={this.state.tipText}/>
                    <Header />
                    <div className="page-header">
                      <h1 className="normal-title">我的回收站</h1>
                      <div className="empty-btn" onClick={this.removeAllPost.bind(this)}>
                        全部清空
                      </div>
                    </div>
                    <div className="public-body flex-column">    
                          <div className="trash-box wrapper">
                              <div className="item-list">
                              {
                                this.generateTrash()
                              }
                              </div>
                          </div>
                          <ul className="ul-page">
                            <li><Link to="/"><FontAwesomeIcon icon="angle-left"/></Link></li>
                            <li className="active"><Link to="/">1</Link></li>
                            <li><Link to="/"><FontAwesomeIcon icon="angle-right"/></Link></li>
                          </ul>
                   </div>
                </div>
            </div>
        );
    }
}

export default Page;