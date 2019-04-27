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
            timer: null,
            time: 0
        }
    }

    show () {
        this.setState({
            timer: setTimeout(() => {
                this.setState({
                    isShow: true,
                    time: this.state.time + 1
                })
                if (this.state.time === 2) {
                    this.setState({
                        timer: null,
                        time: 0,
                        isShow: false
                    })
                }
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