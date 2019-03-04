import React, {Component} from 'react';
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss';

class Header extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div class="wrapper-header">
                <Link to="/setting" className="header-icon"><FontAwesomeIcon icon="cog"/></Link>
                <div className="wrapper-tip">
                    <Link to="/info" className="header-icon"><FontAwesomeIcon icon="bell"/></Link>
                    <div className="wrapper-users">
                        <img src={require('../../assets/images/avatar.jpg')} class="header-avatar"/>
                        <span class="text-name">新酱</span>
                        <FontAwesomeIcon icon="angle-down"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;