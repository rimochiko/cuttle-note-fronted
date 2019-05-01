import React, {Component} from 'react';
import Sidebar from '../../../layouts/sidebar/sidebar';
import DropDown from '../../../components/dropdown/';
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
            posts: [],
            object: {
                id: '',
                name: '',
                avatar: '',
                type: ''
            },
            post: {
                author: '',
                content: '',
                createDate: '',
                comments: []
            },
            spaceList: []
        }
    }

    /** 
     * 删除文章
    */
    showRemovePost () {
    }
    
    /**
     * 展示文章信息
     */
    showInfoPost() {

    }
  

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="flex-row overflow">
                    <div className="left flex-column bg-box">
                    <div className="relate">
                        <div className="switch">
                            <DropDown data={this.state.spaceList}>
                            <img src={this.state.object.avatar}
                                 className="link-img"/>
                                {this.state.object.nickname}的空间
                                <FontAwesomeIcon icon="caret-down" className="link-svg"/>
                            </DropDown>                      
                        </div>
                        <div className="option">
                          <Link to="/photo/edit">
                            <FontAwesomeIcon icon="plus" />
                          </Link>
                        </div>
                      </div>                        
                      <div className="imglist">
                        <ul className="component-img-list">
                          {
                              this.state.posts.map((item) => {
                                  return (
                                  <li className="component-img-item">
                                    <Link to="/">
                                      <img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
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
                            isAuth={false}
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