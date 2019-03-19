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
            <div className="public-options">
                <Link to="/" className="header-icon"><FontAwesomeIcon icon="trash" /></Link>
                <Link to="/" className="header-icon"><FontAwesomeIcon icon="search" /></Link> 
                <Link to="/info" className="header-icon"><FontAwesomeIcon icon="bell"/></Link>
            </div>
        );
    }
}

export default Options;