import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Route, Switch} from 'react-router-dom';
import {
  LibEditPage,
  LibArticlePage
} from '..';
import Tree from '../../../components/tree';

let treeData = [{
  id: 1,
  name: '根目录1',
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



class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div>
                <Sidebar />
                <div className="main">
                    <div className="left">
                      <div className="options">
                        <FontAwesomeIcon icon="trash-alt" />
                        <FontAwesomeIcon icon="search" /> 
                        <FontAwesomeIcon icon="folder" /> 
                      </div>
                      <div className="textlist-box">
                        <Tree data={treeData} />
                      </div>                 
                    </div>
                    <div className="right">
                        <Header />
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