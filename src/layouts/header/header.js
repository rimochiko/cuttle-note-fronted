import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import DropDown from '../../components/dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss';

let dropMenudata = [{
    id: 1,
    text: '我的主页',
    link: '/'
}, {
    id: 2,
    text: '退出',
    link: '/login'
}]

class Header extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="wrapper-header">
                <Link to="/setting" className="header-icon"><FontAwesomeIcon icon="cog"/></Link>
                <div className="wrapper-tip">
                    <Link to="/info" className="header-icon"><FontAwesomeIcon icon="bell"/></Link>
                    <DropDown className="wrapper-users" data={dropMenudata}>
                        <span className="mck-dropdown-link">
                           <img src={require('../../assets/images/avatar.jpg')} className="header-avatar"/>
                           新酱
                           <FontAwesomeIcon icon="angle-down"/>
                        </span>
                    </DropDown>
                </div>
            </div>
        );
    }
}

export default Header;