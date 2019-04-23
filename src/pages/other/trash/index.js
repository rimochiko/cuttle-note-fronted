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
import { inject, observer } from 'mobx-react';
import axios from 'axios';

@inject('userStore', 'postStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          posts: []
        }
        this.getTrashList = this.getTrashList.bind(this);
    }

    async componentWillMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
      }
      this.getTrashData();
    }

    /**
     * 获取回收站数据
     * @param {*} type 
     */
    getTrashData () {
      const query = `
        query {
          data:
          trashPosts(
            userId: "${this.props.userStore.user.userId}",
            token: "${this.props.userStore.user.token}"
          ) {
            code
            posts {
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
        if(res.code === 1) {
          this.setState({
            posts: res.posts
          });
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
          <p className="info">{this.getTrashIcon(item.type)}{item.title}</p>
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
                    <div className="page-header">
                      <h1 className="normal-title">我的回收站</h1>
                      <div className="empty-btn">
                        全部清空
                      </div>
                    </div>
                    <div className="public-body flex-column">    
                          <div className="trash-box wrapper">
                              <div className="item-list">
                              {
                                this.state.posts.map((item, index) => {
                                  return this.getTrashList(item);
                                })
                              }
                              </div>
                          </div>
                          <ul className="ul-page">
                            <li><Link to="/">&lt;</Link></li>
                            <li className="active"><Link to="/">1</Link></li>
                            <li><Link to="/">2</Link></li>
                            <li><Link to="/">3</Link></li>
                            <li><Link to="/">&gt;</Link></li>
                          </ul>
                   </div>
                </div>
            </div>
        );
    }
}

export default Page;