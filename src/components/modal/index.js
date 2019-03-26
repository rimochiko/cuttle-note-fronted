import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Modal extends Component {
    constructor () {
        super();
    }

    render () {
        const { children } = this.props;
        return (
            <div className="mck-modal">
                <div className="mck-modal-box">
                    <div className="mck-modal-header">
                      <p className="title">{this.props.title}</p>
                      <span className="close"><FontAwesomeIcon icon="times"/></span>
                    </div>
                    {children}
                </div>
            </div>
        );
    }
}

export default Modal;