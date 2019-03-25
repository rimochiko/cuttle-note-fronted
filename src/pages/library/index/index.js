import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Route, Switch, Link} from 'react-router-dom';
import {
  LibEditPage,
  LibArticlePage
} from '..';
import Tree from '../../../components/tree';
import Options from '../../../layouts/options/'; 

let treeData = [{
  id: 1,
  name: '我的空间',
  link: '/1',
  isOpen: true,
  child : [{
    id: 11,
    name: '二级目录1',
    link: '/1-1',
    isOpen: true,
    child : [{
      id: 111,
      name: '三级目录1',
      link: '/1-1-1',
      isOpen: true,
      child : []
    }]
  }, {
    id: 12,
    name: '二级目录2',
    link: '/1-2',
    isOpen: true,
    child : []
  }]
}, {
  id: 2,
  name: '根目录2',
  link: '/2',
  isOpen: true,
  child : [{
    id: 21,
    name: '二级目录1',
    link: '/2-1',
    isOpen: true,
    child : []
  }]
}]

let optiondata = [{
  id: 2,
  text: '草稿箱',
  link: '/',
  icon: ['far','clipboard'],
}, {
  id: 3,
  text: '收藏夹',
  link: '/',
  icon: ['far','star']
}, {
  id: 4,
  text: '回收站',
  link: '/',
  icon: ['far','trash-alt']
}];


class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
           <div className="page">
                <Sidebar />
                <div className="flex-row overflow">
                    <div className="left white">
                      <Options data={optiondata}/>
                      <div className="tree">
                        <Tree data={treeData} />
                      </div>                 
                    </div>
                    <div className="right flex-scroll-y">
                        <Switch>
                          <Route exact path="/library" component={LibArticlePage}/>
                          <Route path="/library/edit" component={LibEditPage} />
                          <Route path="/library/article" component={LibArticlePage} />
                        </Switch> 
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;