import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import { 
  Switch,
  Link,
  Route
 } from 'react-router-dom';

 import Mind from './Mind';
 import Flow from './Flow';

class Page extends Component {
    constructor () {
        super();
        this.state = {}
    }

    componentWillMount () {

    }

    componentDidMount () {

    }


    render () {
        return (
          <div className="flex-row overflow">
            <Sidebar />
            <div className="flex-column edit-chart-page">
                <div className="chart-edit-header">
                  <input type="text" placeholder="标题" className="edit-input"/>
                  <div className="btns-box">
                    <button className="radius-btn sub-btn">保存草稿</button>
                    <button className="radius-btn input-btn">发布</button>
                  </div>
                </div>

                <Switch>
                    <Route path="/photo/edit/" exact component={Mind} />
                    <Route path="/photo/edit/mind" component={Mind} />
                    <Route path="/photo/edit/flow" component={Flow} />
                </Switch> 
                
            </div> 
          </div>
        );
    }
}

export default Page;