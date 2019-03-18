import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import DropDown from '../../components/dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss';

let dropMenudata = [{
    id: 1,
    text: '我的主页',
    link: '/',
    icon: 'user'
}, {
    id: 2,
    text: '账号设置',
    link: '/setting',
    icon: 'cog'
}, {
    id: 3,
    text: '退出',
    link: '/login',
    icon: 'sign-out-alt'
}]

class Header extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="public-header">
                <Link to="/info" className="header-icon"><FontAwesomeIcon icon="bell"/></Link>
                <div className="tip">  
                    <DropDown data={dropMenudata}>
                        <span className="mck-dropdown-link">
                           <img src={require('../../assets/images/avatar.jpg')} className="header-avatar"/>
                        </span>
                    </DropDown>
                </div>
            </div>
        );
    }
}

export default Header;