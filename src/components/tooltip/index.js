import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {CSSTransition} from 'react-transition-group';
import cs from 'classnames';

class Tooltip extends Component {
    constructor () {
        super();
        this.state = {
            isShow: false,
            timer: null
        }
    }

    show () {
        this.setState({
            isShow: true
        });
        this.setState({
            timer: setTimeout(() => {
                this.setState({
                    timer: null,
                    isShow: false
                })
            }, 1000)
        })
    }
    render () {
        return (
            <div className={cs({
                'mck-tooltip': true,
                'show': this.state.isShow
          })}>
              <p>{this.props.text || ''}</p>
            </div>
        );
    }
}

export default Tooltip;