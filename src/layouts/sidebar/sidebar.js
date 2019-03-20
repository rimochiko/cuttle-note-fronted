import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom';
import config from './config';
import './sidebar.scss';
import DropDown from '../../components/dropdown';
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

class Sidebar extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="public-sidebar">
              <div className="logo">
                <DropDown data={dropMenudata}>
                    <span className="mck-dropdown-link">
                    <img src={require('../../assets/images/avatar.jpg')} className="header-avatar"/>
                    </span>
                </DropDown>
              </div>
              <ul className="ul-nav">
                {
                    config.map((item, index) => {
                            return <li key={item.name}  className="li-nav">
                               <Link to={item.url} className="link-nav" title={item.text}>
                                    <FontAwesomeIcon icon={item.icon} className="link-icon"/>
                               </Link>
                            </li>
                    })
                }
              </ul>
              <div></div>
            </div>
        );
    }
}

export default Sidebar;