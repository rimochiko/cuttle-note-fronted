import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {CSSTransition} from 'react-transition-group';
import cs from 'classnames';

class Switch extends Component {
    constructor () {
        super();
        this.state = {
            ischecked: false
        }
    }
    toggle () {
        this.setState({
            ischecked: !this.state.ischecked
        });
        console.log(this.state.ischecked)
    }
    render () {
        return (
            <div className="mck-switch">
              <input type="checkbox" onChange={this.toggle.bind(this)}/>
              <div className={cs({
                    'mck-switch-container': true,
                    'active': this.state.ischecked 
              })}>
                <div className="mck-switch-radio"></div>
              </div>
            </div>
        );
    }
}

export default Switch;