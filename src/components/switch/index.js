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
            isChecked: false
        }
    }
    componentDidMount () {
        this.setState({
            isChecked: this.props.isChecked
        })
    }
    toggle () {
        this.setState({
            isChecked: !this.state.isChecked
        });
        this.props.toggle && this.props.toggle(this.state.isChecked);
    }
    render () {
        return (
            <div className="mck-switch">
              <input type="checkbox" onChange={this.toggle.bind(this)} defaultChecked={this.state.isChecked}/>
              <div className={cs({
                    'mck-switch-container': true,
                    'active': this.state.isChecked 
              })}>
                <div className="mck-switch-radio"></div>
              </div>
            </div>
        );
    }
}

export default Switch;