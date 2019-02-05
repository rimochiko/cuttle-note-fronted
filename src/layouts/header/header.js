import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss';

class Header extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div class="wrapper-header">
                <a href="#" className="header-icon"><FontAwesomeIcon icon="cog"/></a>
                <div className="wrapper-tip">
                    <a href="#" className="header-icon"><FontAwesomeIcon icon="bell"/></a>
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