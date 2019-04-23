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


@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          posts: []
        }
        this.getCollectList = this.getCollectList.bind(this);
    }

    async componentWillMount() {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
      }
      this.getCollectData();
    }

    /**
     * 获取收藏数据
     * @param {*} type 
     */
    getCollectData () {
      const query = `
      query {
        data:
        collectPosts(
          userId: \"${this.props.userStore.user.userId}\",
          token: \"${this.props.userStore.user.token}\"
        ) {
          code,
          posts {
            id,
            title,
            type,
            author {
              id,
              nickname,
              avatar
            }
            group {
              id,
              nickname,
              avatar
            }
          }
        }
      }`;
      axios.post('/graphql', {query})
      .then(({data}) => {
        let res = data.data.data;
        console.log(data);
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
     * 取消收藏文章
     *  */
    cancelCollect (id, index) {
        const query = `
          mutation {
            data:
            postUncollect (
                postId: ${id},
                token: \"${this.props.userStore.user.token}\",
                userId: \"${this.props.userStore.user.userId}\"
            )
          }
        `
        axios.post('/graphql', {query})
        .then(({data}) => {
            let res = data.data.data;
            if (res) {
                // 取消收藏成功
                let posts = this.state.posts;
                posts.splice(index, 1);
                this.setState({
                    posts: posts
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
    getCollectIcon (type) {
      switch (type) {
        case 0: return (
          <FontAwesomeIcon icon="file-alt" />
        );break;
        case 1: return (
          <FontAwesomeIcon icon="file-image" />
        );
      }
    }

    /** 
     * 获取收藏阅读记录
     * */
   getCollectList (item, index) {
      return (
        <div className="item-collect" key={item.id}>
          <p className="info">
              {this.getCollectIcon(item.type)}
              <Link to={`library/${item.author.type}/${item.author.id}/${item.id}`}>
              {item.title}
              </Link>
          </p>
          <p className="author"><img src={item.author.avatar || require('../../../assets/images/default.jpg')}/><Link to="/">{item.author.nickname}</Link></p>
          <p className="from"><Link to="/">{item.author.nickname}的空间</Link></p>
          <p className="option">
            <span className="collect active" onClick={this.cancelCollect.bind(this, item.id, index)}><FontAwesomeIcon icon="star"/></span>
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
                      <h1 className="normal-title">我的收藏</h1>
                      <div>
                      </div>
                    </div>
                    <div className="public-body flex-column">    
                          <div className="collect-box wrapper">
                            <div className="item-list">
                            {
                              this.state.posts.map((item, index) => {
                                return this.getCollectList(item, index);
                              })
                            }
                            </div>
                          </div>
                          <ul className="ul-page">
                            <li><Link to="/">&lt;</Link></li>
                            <li className="active"><Link to="/">1</Link></li>
                            <li><Link to="/">&gt;</Link></li>
                          </ul>
                   </div>
                   
                </div>
            </div>
        );
    }
}

export default Page;