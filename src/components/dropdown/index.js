import React, {Component} from 'react';
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss';

class DropDown extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="wrapper-dropdown">
                <span></span>
                <ul class="wrapper-dropdown-list">
                {
                    this.props.data.map((item, index) => {
                        return (
                            <li><Link to={item.link}>{item.text}</Link></li>
                        )
                    })
                }
                </ul>
            </div>
        );
    }
}

export default DropDown;