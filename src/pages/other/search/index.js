import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Loading from '../../../components/loading';
import Tooltip from '../../../components/tooltip';
import './index.scss';

import {Route, NavLink, Switch}  from 'react-router-dom';

import Article from './article';
import Chart from './chart';
import Group from './group';
import User from './user';

import Qlquery from './graphql';

const ARTICLE = "article",
      CHART = "chart",
      GROUP = "group",
      USER = "user";

class Page extends Component {
    constructor () {
        super();
        this.state = {
          type: ARTICLE,
          list: [],
          tipText: '',
          search: '',
          page: 1,
          allPage: 0,
          count: 0
        }
    }

    async componentDidMount () {
      // 分析参数
      await this.fetchData(this.props);
      this.refs.loading.toggle();
    }

    toggleLoading () {
      this.refs.loading.toggle();
    }

    async fetchData(props) {
      let params = props.match && props.match.params,
          type;
      if (!params && params.search) {
        return;
      }
      switch(params.type) {
        case ARTICLE: type = ARTICLE;break;
        case CHART: type = CHART;break;
        case GROUP: type = GROUP;break;
        case USER: type = USER;break;
        default: type = ARTICLE;break;
      }

      // 发送请求
      await Qlquery.search({
        type: type,
        search: params.search
      })
      .then(({data}) => {
        let res = data.data.data;
        if(res.code === 0) {
          this.setState({
            type: type,
            page: params.page ? params.page : 1,
            search: params.search,
            list: res.result,
            count: res.count
          })
        }
      });
    }


    async componentWillReceiveProps (nextProps) {
      let prevMatch = this.props.match.params;
      let nextMatch = nextProps.match.params;

      if (prevMatch === nextMatch) {
        return;
      }

      this.refs.loading.toggle();
      this.setState({
        list: [],
        type: nextProps.match && nextProps.match.params && nextProps.match.params.search
      })
      await this.fetchData(nextProps);
      this.refs.loading.toggle();
    }

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="flex-column flex-1 flex-overflow-y">
                    <Loading ref="loading" />
                    <Tooltip ref="tooltip" text={this.state.tipText} />
                    <Header />
                    <div className="flex-row">
                      <div className="left">
                        <ul className="menu-ul">
                          <li><NavLink to={`/search/article/${this.props.match.params && this.props.match.params.search}`} activeClassName="active">文章
                              <span>{this.state.type === ARTICLE ? this.state.count : ''}</span></NavLink></li>
                          <li><NavLink to={`/search/chart/${this.props.match.params && this.props.match.params.search}`} activeClassName="active">图
                              <span>{this.state.type === CHART ? this.state.count : ''}</span></NavLink></li>
                          <li><NavLink to={`/search/group/${this.props.match.params && this.props.match.params.search}`} activeClassName="active">团队
                              <span>{this.state.type === GROUP ? this.state.count : ''}</span></NavLink></li>
                          <li><NavLink to={`/search/user/${this.props.match.params && this.props.match.params.search}`} activeClassName="active">用户
                              <span>{this.state.type === USER ? this.state.count : ''}</span></NavLink></li>
                        </ul>
                      </div>

                      <div className="flex-column flex-1">    
                        <Switch>
                            <Route path="/search/article/:keywords"
                                    render={(props) => (
                                    <Article
                                      {...props}
                                      list={this.state.list} 
                                      keyword={this.state.search}
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                            <Route path="/search/chart/:keywords"
                                    render={(props) => (
                                    <Chart
                                      {...props} 
                                      list={this.state.list} 
                                      keyword={this.state.search}
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                            <Route path="/search/group/:keywords"
                                    render={(props) => (
                                    <Group
                                      {...props} 
                                      list={this.state.list}
                                      keyword={this.state.search} 
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                             <Route path="/search/user/:keywords"
                                    render={(props) => (
                                    <User
                                      {...props} 
                                      list={this.state.list} 
                                      keyword={this.state.search}
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                        </Switch>  
                     </div>
                    
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;