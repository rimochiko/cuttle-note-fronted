import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

class Options extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <ul className="public-options">
            {
                this.props.data.map((item, index) => {
                    return (
                        <Link to={item.link} className="header-icon" title={item.text} key={item.id}><FontAwesomeIcon icon={item.icon} /></Link>
                    )
                })
            }
            </ul>
        );
    }
}

export default Options;