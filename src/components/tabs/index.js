import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import tabPane from './tabPane.js';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Tabs extends Component {
    constructor () {
        super();
        this.state = {
            activeKey: null,
            tabHead: null
        }

    }

    toggleActive (key) {
        console.log(key);
        this.setState({
            activeKey: key
        })
    }

    render () {
        const { children } = this.props;
        let tabHead = children.map((item) => {
            return  {
                name: item.props.tab || "",
                key: item.key
            }
        })
        // 为什么这里state的属性都是null
        return (
            <div className="mck-tabs">
              <ul className="mck-tabs-head">
              {
                      tabHead && tabHead.map((item) => {
                      if (item.key === this.props.defaultActiveKey) {
                         return (
                          <li key={item.key} className="active">{item.name}</li>
                         ) 
                      } else {
                        return (
                            <li key={item.key} onClick={this.toggleActive.bind(this, item.key)}>{item.name}</li>
                        ) 
                      }
                  })
              }
              </ul>
              {
                  children.map((item) => {
                      if (this.state.activeKey === null) {
                          if (item.key === this.props.defaultActiveKey) {
                              return item;
                          }
                      } else {
                          if (item.key === this.state.activeKey) {
                              return item;
                          }
                      }
                  })
              }
            </div>
        );
    }
}

Tabs.TabPane = tabPane;

export default Tabs;