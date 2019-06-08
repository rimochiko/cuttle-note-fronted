import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {CSSTransition} from 'react-transition-group';

class Modal extends Component {
    constructor () {
        super();
        this.state = {
            visible: false,
            style: {display:'none'}
        }
        this.generateBtn = this.generateBtn.bind(this);
    }
    componentDidMount () {
        this.boxDOM = ReactDOM.findDOMNode(this.refs.modal);
    }
    /*
     * 展示：display是flex的情况下如何处理更好？
     */
    toggle (setValue = null) {
        let value = !this.state.visible;
        if ((setValue !== null) && (typeof setValue === "boolean")) {
            value = setValue
        }
        this.setState({
            visible: value
        })
    }

    generateBtn () {
        if (this.props.close) {
            return (
                <span className="close"></span>
            )
        } else {
            return (
                <span className="close" onClick={this.toggle.bind(this)}><FontAwesomeIcon icon="times"/></span>
            )
        }
    }

    render () {
        const { children } = this.props;
        return (
            <CSSTransition 
                in={this.state.visible} 
                classNames="modal" timeout={300}
                onEnter={()=>{
                    this.boxDOM.style.display = "flex";
                }}
                onExited={()=>{
                    this.boxDOM.style.display = "none";
                }}
            >
                <div className="mck-modal" ref="modal">
                    <div className="mck-modal-box">
                        <div className="mck-modal-header">
                        <p className="title">{this.props.title}</p>
                        {this.generateBtn()}
                        </div>
                        {children}
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

export default Modal;